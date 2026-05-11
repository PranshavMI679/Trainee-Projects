const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Reaction = sequelize.define('Reaction', {
  reaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  blog_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reaction_type: {
    type: DataTypes.ENUM('heart', 'thumbs_up', 'smile', 'clap', 'party'),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Reaction;
