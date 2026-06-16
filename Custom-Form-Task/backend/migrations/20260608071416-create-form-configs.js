'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('form_configs', {
      config_code: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      label: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null
      },
      section_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'General Information'
      },
      section_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 
      },
      area_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Main Group'
      },
      area_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 
      },
      field_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('form_configs', ['config_code'], {
      name: 'idx_form_configs_config_code'
    });

    await queryInterface.addIndex('form_configs', ['client_id', 'config_code', 'section_order', 'area_order', 'field_order'], {
      name: 'idx_form_configs_layout_sorting'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('form_configs', 'idx_form_configs_layout_sorting');
    await queryInterface.removeIndex('form_configs', 'idx_form_configs_config_code');
    await queryInterface.dropTable('form_configs');
  }
};
