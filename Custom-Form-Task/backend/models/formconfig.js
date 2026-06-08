const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormConfig = sequelize.define('FormConfig', {
  config_code: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true 
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    primaryKey: true
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  }
}, {
  tableName: 'form_configs',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['config_code'] }
  ]
});

module.exports = FormConfig;
