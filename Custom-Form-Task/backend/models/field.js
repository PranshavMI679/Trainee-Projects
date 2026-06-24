const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Field = sequelize.define('Field', {
  field_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  field_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true
  },
  area_code: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
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
    defaultValue: null,
  },
  field_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'fields',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_fields_parent_uuid_lookup',
      fields: ['area_code']
    },
    {
      name: 'idx_fields_sorting_grid_v3',
      fields: ['area_code', 'field_order']
    },
    {
      unique: true,
      name: 'uidx_area_field_key_collision',
      fields: ['area_code', 'key'] 
    }
  ]
});

module.exports = Field;
