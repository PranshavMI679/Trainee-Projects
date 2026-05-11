const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BlogApprovalRequest = sequelize.define('BlogApprovalRequest', {
  request_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  blog_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('approval pending', 'approved'),
    defaultValue: 'approval pending',
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = BlogApprovalRequest;
