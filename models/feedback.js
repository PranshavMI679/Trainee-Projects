const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  feedback_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  blog_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  feedback_given_by: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  feedback_content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Feedback;
