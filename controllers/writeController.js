const { BlogPost, Category, Feedback } = require('../models');
const { getPresignedUrl } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

exports.createBlogPost = async (req, res) => {
    try {
        const { category_name, blog_title, blog_image, content} = req.body;

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

        if (!blog_title || !content || !category_name) {
            return res.status(400).json({ message: "Title, content, and category name are required." });
        }

        const categoryRecord = await Category.findOne({
            where: { category_name: category_name.trim() }
        });
        if (!categoryRecord) {
            return res.status(404).json({ 
                message: `Category '${category_name}' does not exist. Please use an existing category.` 
            });
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
            message: "Blog post created successfully",
            data: newPost
        });
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.editBlog = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const { category_name, blog_title, blog_image, content } = req.body;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        const post = await BlogPost.findByPk(blog_id);
        if (!post) {
            return res.status(404).json({ message: "Target blog post could not be found." });
        }

        if (post.status !== 'draft' && post.status !== 'approval pending' && post.status !== 'recheck') {
            return res.status(403).json({ 
                message: `Action denied. You can only edit drafts, pending, or recheck posts. Current status is '${post.status}'.` 
            });
        }

        let category_id = post.category_id;
        if (category_name && category_name.trim() !== "") {
            const categoryRecord = await Category.findOne({ where: { category_name: category_name.trim() } });
            if (!categoryRecord) {
                return res.status(404).json({ message: `Category '${category_name}' does not exist.` });
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

        return res.status(200).json({ message: responseMessage, data: post });
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.submitBlogForApproval = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        const post = await BlogPost.findByPk(blog_id);
        if (!post) {
            return res.status(404).json({ message: "Blog post record could not be found." });
        }

        if (post.status !== 'draft') {
            return res.status(400).json({ 
                message: `Cannot submit. Only 'draft' posts can be sent for approval. Current status is '${post.status}'.` 
            });
        }

        post.status = 'approval pending';
        await post.save();

        return res.status(200).json({
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
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getFeedback = async (req, res) => {
  const { blog_id } = req.params;
  const current_user_id = req.user?.id || req.user?.user_id || req.user?.userId;

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const feedback = await Feedback.findOne({
      where: { blog_id: blog_id },
      order: [['createdAt', 'DESC']]
    });

    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: 'No admin feedback has been submitted for this blog post yet.' 
      });
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

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.publishBlog = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        const post = await BlogPost.findByPk(blog_id);
        if (!post) {
            return res.status(404).json({ message: "Blog post record could not be found." });
        }

        if (post.status !== 'approved') {
            return res.status(400).json({ 
                message: `Cannot submit. Only approved posts can be published. Current status is '${post.status}'.` 
            });
        }

        post.status = 'published';
        await post.save();

        return res.status(200).json({
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
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};