const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Form = sequelize.define('Form', {
  employee_code: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    unique: true
  },
  client_code: {
    type: DataTypes.UUID, 
    allowNull: false,
  },
  module_code: {
    type: DataTypes.UUID,
    allowNull: false,
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
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_forms_secure_entity_lookup',
      fields: ['client_code', 'module_code', 'employee_code']
    },
    {
      name: 'idx_forms_custom_values_gin',
      using: 'gin',
      fields: ['custom_values'] 
    }
  ]
});

module.exports = Form;
