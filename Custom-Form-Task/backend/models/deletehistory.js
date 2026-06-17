const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DeleteHistory = sequelize.define('DeleteHistory', {
  deletion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  config_code: {
    type: DataTypes.UUID,
    allowNull: false
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING(100),
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
    allowNull: false,
    defaultValue: false
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  section_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  section_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  area_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  area_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  field_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  archived_options: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  action_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'delete_histories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_del_hist_config_code',
      fields: ['config_code']
    },
    {
      name: 'idx_del_hist_client_id',
      fields: ['client_id']
    },
    {
      name: 'idx_del_hist_composite_lookup',
      fields: ['config_code', 'key']
    }
  ]
});

module.exports = DeleteHistory;
