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
  comment_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reaction_type: {
    type: DataTypes.ENUM('heart', 'thumbs_up', 'smile', 'clap', 'party'),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Reactions',
  timestamps: false,
  indexes: [
    {
      name: 'unique_user_blog_direct_reaction',
      unique: true,
      fields: ['blog_id', 'user_id'],
      where: {
        comment_id: null
      }
    },
    {
      name: 'unique_user_comment_reaction',
      unique: true,
      fields: ['blog_id', 'comment_id', 'user_id']
    }
  ]
});

module.exports = Reaction;
