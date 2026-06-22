const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormConfig = sequelize.define('FormConfig', {
  config_code: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true 
  },
  client_code: {
    type: DataTypes.UUID, 
    allowNull: false
  },
  module_code: {
    type: DataTypes.UUID, 
    allowNull: false
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    primaryKey: true
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null
  },
  section_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'General Information'
  },
  section_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  },
  area_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Main Group'
  },
  area_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  },
  field_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  }
}, {
  tableName: 'form_configs',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { 
      name: 'idx_form_configs_code',
      fields: ['config_code'] 
    },
    {
      name: 'idx_form_configs_secure_lookup',
      fields: ['client_code', 'module_code']
    },
    {
      name: 'idx_form_configs_layout_sorting_v2',
      fields: ['client_code', 'module_code', 'config_code', 'section_order', 'area_order', 'field_order']
    }
  ]
});

module.exports = FormConfig;
