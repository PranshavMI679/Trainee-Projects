const { BlogPost, Category, Feedback, User, Following, Interest } = require('../models');
const { getPresignedUrl } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const NotificationService = require('../utils/notificationService');

const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.createBlogPost = async (req, res, next) => {
    try {
        const { category_name, blog_title, blog_image, content } = req.body;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        let imageKeys = req.files && req.files.length > 0 ? req.files.map(file => file.key) : [];

        if (imageKeys.length === 0 && blog_image) {
            if (Array.isArray(blog_image)) {
                imageKeys = blog_image.filter(img => img.trim() !== "");
            } 
            else if (typeof blog_image === 'string' && blog_image.trim() !== "") {
                imageKeys = [blog_image.trim()];
            }
        }

        const categoryRecord = await Category.findOne({
            where: { category_name: category_name.trim() }
        });
        
        if (!categoryRecord) {
            return next(new AppError(ErrorMessages.RESOURCE.CATEGORIES_NOT_EXIST, 404));
        }

        const category_id = categoryRecord.category_id;

        const newPost = await BlogPost.create({
            blog_id: uuidv4(),
            user_id,
            category_id,
            blog_title,
            blog_image: imageKeys,
            content,
            status: 'draft'
        });

        return res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            data: newPost
        });
    } 
    catch (error) {
        return next(error);
    }
};

exports.editBlog = async (req, res, next) => {
    try {
        const { blog_id } = req.params;
        const { category_name, blog_title, blog_image, content } = req.body;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        const post = await BlogPost.findByPk(blog_id);
        if (!post) {
            return next(new AppError(ErrorMessages.RESOURCE.TARGET_BLOG_NOT_FOUND, 404));
        }

        if (post.status !== 'draft' && post.status !== 'approval pending' && post.status !== 'recheck') {
            const forbiddenMessage = `${ErrorMessages.STATE.CANNOT_EDIT_STATUS}'${post.status}'.`;
            return next(new AppError(forbiddenMessage, 403));
        }

        let category_id = post.category_id;
        if (category_name && category_name.trim() !== "") {
            const categoryRecord = await Category.findOne({ where: { category_name: category_name.trim() } });
            if (!categoryRecord) {
                return next(new AppError(ErrorMessages.RESOURCE.CATEGORIES_NOT_EXIST, 404));
            }
            category_id = categoryRecord.category_id;
        }

        let finalImagesArray = post.blog_image || [];
        if (req.files && req.files.length > 0) {
            finalImagesArray = req.files.map(file => file.key);
        } else if (blog_image) {
            finalImagesArray = Array.isArray(blog_image) ? blog_image : [blog_image];
        }

        let currentStatus = post.status;
        if (currentStatus === 'approval pending' || currentStatus === 'recheck') {
            currentStatus = 'draft';
        }

        post.category_id = category_id;
        post.blog_title = blog_title || post.blog_title;
        post.blog_image = finalImagesArray;
        post.content = content || post.content;
        post.status = currentStatus;

        await post.save();
        
        const responseMessage = post.status === 'draft' && (post.status !== post.previous('status'))
            ? "Blog post updated successfully and reverted to draft status until resubmitted."
            : "Blog post updated successfully.";

        return res.status(200).json({ 
            success: true,
            message: responseMessage, 
            data: post 
        });
    } 
    catch (error) {
        return next(error);
    }
};

exports.submitBlogForApproval = async (req, res, next) => {
    try {
        const { blog_id } = req.params;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        const post = await BlogPost.findByPk(blog_id);
        if (!post) {
            return next(new AppError(ErrorMessages.RESOURCE.BLOG_RECORD_NOT_FOUND, 404));
        }

        if (post.status !== 'draft') {
            const forbiddenMessage = `${ErrorMessages.STATE.CANNOT_SUBMIT_STATUS}'${post.status}'.`;
            return next(new AppError(forbiddenMessage, 400));
        }

        post.status = 'approval pending';
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Blog post successfully submitted to admin queue for approval and feedback.",
            data: {
                blog_id: post.blog_id,
                blog_title: post.blog_title,
                status: post.status,
                updated_at: post.updated_at
            }
        }); 
    } 
    catch (error) {
        return next(error);
    }
};

exports.getFeedback = async (req, res, next) => {
  const { blog_id } = req.params;
  const current_user_id = req.user?.id || req.user?.user_id || req.user?.userId;

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return next(new AppError(ErrorMessages.RESOURCE.BLOG_NOT_FOUND, 404));
    }

    const feedback = await Feedback.findOne({
      where: { blog_id: blog_id },
      order: [['createdAt', 'DESC']]
    });

    if (!feedback) {
      return next(new AppError(ErrorMessages.RESOURCE.NO_FEEDBACK_FOUND, 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback for this blog draft.',
      updated_blog: {
        blog_id: blog.blog_id,
        blog_title: blog.blog_title,
        status: blog.status,
        rechecked_by: blog.rechecked_by
      },
      feedback_details: feedback
    });

  } 
  catch (error) {
    return next(error);
  }
};

exports.publishBlog = async (req, res, next) => {
    try {
        const { blog_id } = req.params;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        const post = await BlogPost.findByPk(blog_id);
        if (!post) {
            return next(new AppError(ErrorMessages.RESOURCE.BLOG_RECORD_NOT_FOUND, 404));
        }

        if (post.status !== 'approved') {
            const forbiddenMessage = `${ErrorMessages.STATE.CANNOT_PUBLISH_STATUS}'${post.status}'.`;
            return next(new AppError(forbiddenMessage, 400));
        }

        post.status = 'published';
        await post.save();

        if (post.user_id) {
            await NotificationService.trigger({
                io: req.io,
                userId: post.user_id,
                mainType: 'updates',
                subType: 'published',
                metadata: {},
                userEmail: null
            });
        }

        if (post.approved_by) {
            await NotificationService.trigger({
                io: req.io,
                userId: post.approved_by,
                mainType: 'updates',
                subType: 'approved blog got published',
                metadata: {},
                userEmail: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog post published successfully.",
            data: {
                blog_id: post.blog_id,
                blog_title: post.blog_title,
                status: post.status,
                updated_at: post.updated_at
            }
        }); 
    } 
    catch (error) {
        return next(error);
    }
};

exports.getParticularBlog = async (req, res, next) => {
  try {
    const { blog_id } = req.params;
    const blog = await BlogPost.findByPk(blog_id);

    if (!blog) {
      return next(new AppError(ErrorMessages.RESOURCE.BLOG_NOT_FOUND, 404));
    }

    let authorData = null;
    if (blog.user_id) {
      authorData = await User.findOne({
        where: { user_id: blog.user_id },
        attributes: ['user_id', 'name', 'email']
      });
    }

    return res.status(200).json({
      success: true,
      blog: {
        ...blog.toJSON(),
        author: authorData
      }
    });
  } 
  catch (error) {
    return next(error);
  }
};
