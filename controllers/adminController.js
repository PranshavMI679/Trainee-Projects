const { BlogPost, Feedback, User, Category } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.getPendingBlogs = async (req, res) => {
  try {
    const pendingBlogs = await BlogPost.findAll({
      where: { status: 'approval pending' },
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });

    return res.status(200).json({
      success: true,
      count: pendingBlogs.length,
      data: pendingBlogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.recheckBlog = async (req, res) => {
  const { blog_id } = req.params;
  const { feedback_content } = req.body;
  const admin_id = req.user.user_id;

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (blog.status !== 'approval pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot recheck a blog that is currently in '${blog.status}' status` 
      });
    }

    blog.status = 'recheck';
    blog.rechecked_by = admin_id;
    await blog.save();

    const feedback = await Feedback.create({
      blog_id: blog_id,
      feedback_given_by: admin_id,
      feedback_content: feedback_content
    });

    return res.status(200).json({
      success: true,
      message: 'Blog has been sent back for changes',
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

exports.approveBlog = async (req, res) => {
  const { blog_id } = req.params;
  const admin_id = req.user?.id || req.user?.user_id || req.user?.userId;

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (blog.status !== 'approval pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot approve a blog that is currently in '${blog.status}' status` 
      });
    }

    blog.status = 'approved'; 
    blog.approved_by = admin_id;
    
    await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Blog post has been successfully approved.',
      updated_blog: {
        blog_id: blog.blog_id,
        blog_title: blog.blog_title,
        status: blog.status,
        approved_by: blog.approved_by
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

