const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
  notif_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  notif_type: {
    type: DataTypes.ENUM('messages', 'updates'),
    allowNull: false
  },
  notif_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
},  {
  timestamps: true,
  createdAt: 'notif_time'
});

module.exports = Notification;
