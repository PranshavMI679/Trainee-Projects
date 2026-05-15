const { BlogPost, User, Category, Following } = require('../models');
const { Op } = require('sequelize');

exports.followingUser = async (req, res) => {
  try {
    const followerId = req.user.user_id; 
    const { targetUsername } = req.body;

    if (req.user.name === targetUsername) {
      return res.status(400).json({ 
        success: false, 
        message: "You cannot follow yourself" 
      });
    }

    const targetUser = await User.findOne({
      where: { name: targetUsername },
      attributes: ['user_id']
    });
    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const [follow, created] = await Following.findOrCreate({
      where: {
        follower_id: followerId,
        user_id: targetUser.user_id
      }
    });
    if (!created) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already following this user" 
      });
    }

    res.status(201).json({
      success: true,
      message: `You are now following ${targetUsername}`
    });

  } catch (error) {
    console.error('Follow Error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing follow request" 
    });
  }
};

exports.featuredFeed = async (req, res) => {
  try {
    const current_user_id = req.user?.id || req.user?.user_id || req.user?.userId;

    const followingsList = await Following.findAll({
      where: { user_id: current_user_id },
      attributes: ['follower_id']
    });

    const followedAuthorIds = followingsList.map(follow => follow.follower_id);

    if (followedAuthorIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You are not following any authors yet. Your feed is empty.",
        count: 0,
        posts: []
      });
    }

    const posts = await BlogPost.findAll({
      where: {
        status: 'published',
        user_id: { [Op.in]: followedAuthorIds }
      },
      attributes: ['blog_id', 'blog_title', 'content', 'created_at', 'updated_at'],
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Category, attributes: ['category_name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts: posts
    });

  } catch (error) {
    console.error('Featured Feed Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching featured feed', 
      error: error.message 
    });
  }
};


