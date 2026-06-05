const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Form = sequelize.define('Form', {
  employee_id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    unique: true,
  },
  employee_code: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    primaryKey: true      
  },
  client_code: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  middle_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Others'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    unique: true
  }
}, { 
    tableName: 'forms',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Form;
