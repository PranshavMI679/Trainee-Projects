const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  user_id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true } 
  },
  password_hash: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  }
}, { 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: false 
});

module.exports = User;
