const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormConfig = sequelize.define('FormConfig', {
  config_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    primaryKey: true 
  },
  client_code: {
    type: DataTypes.UUID, 
    allowNull: false,
    comment: 'Relational anchor linking this configuration back to a specific corporate account'
  },
  module_code: {
    type: DataTypes.UUID, 
    allowNull: false,
    comment: 'Relational anchor linking this layout configuration directly to a parent workspace feature'
  },
  config_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Unified Configuration Layout'
  }
}, {
  tableName: 'form_configurations', 
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { 
      name: 'idx_form_configurations_secure_lookup',
      fields: ['client_code', 'module_code', 'config_code']
    }
  ]
});

module.exports = FormConfig;
