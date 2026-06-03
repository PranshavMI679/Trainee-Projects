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

User.belongsToMany(User, { as: 'Followings', through: Following, foreignKey: 'follower_id', otherKey: 'user_id' });
User.belongsToMany(User, { as: 'Followers', through: Following, foreignKey: 'user_id', otherKey: 'follower_id' });

User.hasOne(Interest, { foreignKey: 'user_id' });
Interest.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(BlogPost, { foreignKey: 'user_id' });
BlogPost.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(BlogPost, { foreignKey: 'approved_by', as: 'ApprovedBlogs' });
BlogPost.belongsTo(User, { foreignKey: 'approved_by', as: 'Approver' });

User.hasMany(BlogPost, { foreignKey: 'rechecked_by', as: 'RecheckedBlogs' });
BlogPost.belongsTo(User, { foreignKey: 'rechecked_by', as: 'Rechecker' });

Category.hasMany(BlogPost, { foreignKey: 'category_id' });
BlogPost.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

BlogPost.hasMany(Reaction, { foreignKey: 'blog_id', onDelete: 'CASCADE' });
Reaction.belongsTo(BlogPost, { foreignKey: 'blog_id' });

Comment.hasMany(Reaction, { foreignKey: 'comment_id', as: 'reactions', onDelete: 'CASCADE' });
Reaction.belongsTo(Comment, { foreignKey: 'comment_id' });

User.hasMany(Reaction, { foreignKey: 'user_id' });
Reaction.belongsTo(User, { foreignKey: 'user_id' });

BlogPost.hasMany(Comment, { foreignKey: 'blog_id', onDelete: 'CASCADE' });
Comment.belongsTo(BlogPost, { foreignKey: 'blog_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_comment_id', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_comment_id' });

BlogPost.hasMany(Feedback, { foreignKey: 'blog_id', onDelete: 'CASCADE' });
Feedback.belongsTo(BlogPost, { foreignKey: 'blog_id' });

User.hasMany(Feedback, { foreignKey: 'feedback_given_by' });
Feedback.belongsTo(User, { foreignKey: 'feedback_given_by', as: 'AdminFeedback' });

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
  BlogPost
};
