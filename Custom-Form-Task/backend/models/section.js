const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Section = sequelize.define('Section', {
  section_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  section_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true
  },
  config_code: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Links directly to the master form layout configuration'
  },
  section_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  section_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_sections_config_lookup',
      fields: ['config_code']
    },
    {
      name: 'idx_sections_sorting_grid',
      fields: ['config_code', 'section_order']
    }
  ]
});

module.exports = Section;
