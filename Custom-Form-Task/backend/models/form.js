const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Form = sequelize.define('Form', {
  employee_code: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    primaryKey: true      
  },
  employee_id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    unique: true,
  },
  config_code: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    unique: true,
  },
  custom_values: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, { 
  tableName: 'forms',
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: 'updated_at' 
});

module.exports = Form;
