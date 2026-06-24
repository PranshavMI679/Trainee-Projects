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
    allowNull: true, 
  },
  client_code: {
    type: DataTypes.UUID,
    allowNull: false
  },
  module_code: {
    type: DataTypes.UUID,
    allowNull: true 
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  archived_meta: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  archived_options: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null
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
      name: 'idx_delete_histories_secure_lookup',
      fields: ['client_code', 'module_code']
    },
    {
      name: 'idx_delete_histories_composite_find',
      fields: ['config_code', 'key']
    }
  ]
});

module.exports = DeleteHistory;
