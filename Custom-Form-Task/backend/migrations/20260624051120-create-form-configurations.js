'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('form_configurations', {
      config_code: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      module_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'module_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      config_name: {
        type: Sequelize.STRING(100),
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

    await queryInterface.addIndex('form_configurations', ['client_code', 'module_code', 'config_code'], {
      name: 'idx_form_configurations_secure_lookup'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('form_configurations');
  }
};
