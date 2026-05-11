const { sequelize } = require('../config/db');

const User = require('./user');
const Reaction = require('./reaction');
const Notification = require('./notification');
const Interest = require('./interest');
const Following = require('./following');
const Feedback = require('./feedback');
const Comment = require('./comment');
const Category = require('./category');
const BlogPost = require('./blog_post');
const BlogApprovalRequest = require('./blog_approval_request');

User.belongsToMany(User, { as: 'Followings', through: Following, foreignKey: 'follower_id', otherKey: 'user_id' });
User.belongsToMany(User, { as: 'Followers', through: Following, foreignKey: 'user_id', otherKey: 'follower_id' });

User.hasOne(Interest, { foreignKey: 'user_id' });
Interest.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(BlogPost, { foreignKey: 'user_id' });
BlogPost.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(BlogPost, { foreignKey: 'category_id' });
BlogPost.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

BlogPost.hasMany(Reaction, { foreignKey: 'blog_id' });
Reaction.belongsTo(BlogPost, { foreignKey: 'blog_id' });
User.hasMany(Reaction, { foreignKey: 'user_id' });
Reaction.belongsTo(User, { foreignKey: 'user_id' });

BlogPost.hasMany(Comment, { foreignKey: 'blog_id' });
Comment.belongsTo(BlogPost, { foreignKey: 'blog_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_comment_id' });
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_comment_id' });

BlogPost.hasOne(BlogApprovalRequest, { foreignKey: 'blog_id' });
BlogApprovalRequest.belongsTo(BlogPost, { foreignKey: 'blog_id' });

User.hasMany(BlogApprovalRequest, { foreignKey: 'admin_id' });
BlogApprovalRequest.belongsTo(User, { foreignKey: 'admin_id', as: 'Admin' });

BlogApprovalRequest.hasMany(Feedback, { foreignKey: 'request_id' });
Feedback.belongsTo(BlogApprovalRequest, { foreignKey: 'request_id' });

User.hasMany(Feedback, { foreignKey: 'admin_id' });
Feedback.belongsTo(User, { foreignKey: 'admin_id', as: 'AdminFeedback' });

module.exports = { 
  sequelize, 
  User, 
  Reaction, 
  Notification, 
  Interest, 
  Following, 
  Feedback, 
  Comment,
  Category,
  BlogPost,
  BlogApprovalRequest
};
