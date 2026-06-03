const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Following = sequelize.define('Following', {
  follower_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  }
}, {
  timestamps: true,
  createdAt: 'followed_on',
  updatedAt: false
});

module.exports = Following;
