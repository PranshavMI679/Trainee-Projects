const { Reaction, BlogPost } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.blogReaction = async (req, res) => {
  const { blog_id } = req.params;
  const { reaction_type } = req.body;
  const user_id = req.user.user_id;

  if (!reaction_type) {
    return res.status(400).json({ success: false, message: 'reaction_type is required' });
  }

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (blog.status !== 'published') {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only react to published blog posts.' 
      });
    }

    const existingReaction = await Reaction.findOne({
      where: { 
        blog_id, 
        user_id,
        comment_id: null 
      }
    });

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction_type) {
        await existingReaction.destroy();
        return res.status(200).json({ 
          success: true, 
          action: 'removed', 
          message: 'Reaction removed successfully' 
        });
      }

      existingReaction.reaction_type = reaction_type;
      await existingReaction.save();
      return res.status(200).json({ 
        success: true, 
        action: 'updated', 
        message: 'Reaction updated successfully',
        data: existingReaction 
      });
    }

    const newReaction = await Reaction.create({
      blog_id,
      user_id,
      reaction_type,
      comment_id: null
    });

    return res.status(201).json({ 
      success: true, 
      action: 'added', 
      message: 'Reaction added successfully',
      data: newReaction 
    });
  } 
  catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
