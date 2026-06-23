const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Module = sequelize.define('Module', {
  module_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  module_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  client_code: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  module_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false
  }
}, {
  tableName: 'modules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeValidate: (moduleInstance) => {
      if (moduleInstance.module_name) {
        moduleInstance.slug = moduleInstance.module_name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/[\s_]+/g, '-');     
      }
    }
  },
  indexes: [
    {
      name: 'idx_modules_secure_client_lookup',
      fields: ['client_code']
    },
    {
      name: 'idx_modules_secure_code_lookup',
      fields: ['module_code']
    },
    {
      unique: true,
      name: 'uidx_modules_client_name_collision',
      fields: ['client_code', 'module_name'] 
    },
    {
      unique: true,
      name: 'uidx_client_module_slug_collision',
      fields: ['client_code', 'slug']
    }
  ]
});

module.exports = Module;
