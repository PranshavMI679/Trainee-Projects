const User = require('../models/user');
const Following = require('../models/following');

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
