'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('section_areas', {
      area_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      area_code: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      section_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sections',
          key: 'section_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      area_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      area_order: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Parent lookup optimization index
    await queryInterface.addIndex('section_areas', ['section_code'], {
      name: 'idx_section_areas_parent_uuid_lookup'
    });

    // Sub-layout sequencing index for dynamic grid rendering
    await queryInterface.addIndex('section_areas', ['section_code', 'area_order'], {
      name: 'idx_section_areas_sorting_grid_v3'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('section_areas');
  }
};
