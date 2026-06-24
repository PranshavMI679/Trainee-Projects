'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sections', {
      section_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      section_code: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      config_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'form_configurations',
          key: 'config_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      section_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      section_order: {
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

    await queryInterface.addIndex('sections', ['config_code'], {
      name: 'idx_sections_config_lookup'
    });

    await queryInterface.addIndex('sections', ['config_code', 'section_order'], {
      name: 'idx_sections_sorting_grid'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sections');
  }
};
