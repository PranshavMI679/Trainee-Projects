const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BlogPost = sequelize.define('BlogPost', {
  blog_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  blog_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  blog_image: {
    type: DataTypes.ARRAY(DataTypes.STRING(255)),
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'approval pending', 'approved', 'recheck', 'published'),
    defaultValue: 'draft',
    allowNull: false
  },
  approved_by: {
  type: DataTypes.UUID,
  allowNull: true 
  },
  rechecked_by: {
  type: DataTypes.UUID,
  allowNull: true 
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BlogPost;
