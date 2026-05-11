const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Interest = sequelize.define('Interest', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  category_ids: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
    defaultValue: []
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
});

module.exports = Interest;
