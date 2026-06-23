const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SectionArea = sequelize.define('SectionArea', {
  area_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  area_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true
  },
  section_code: {
    type: DataTypes.UUID,
    allowNull: false
  },
  area_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  area_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'section_areas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_section_areas_parent_uuid_lookup',
      fields: ['section_code']
    },
    {
      name: 'idx_section_areas_sorting_grid_v3',
      fields: ['section_code', 'area_order']
    }
  ]
});

module.exports = SectionArea;
