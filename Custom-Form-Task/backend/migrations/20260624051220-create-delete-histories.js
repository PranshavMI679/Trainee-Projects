'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delete_histories', {
      deletion_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      config_code: {
        type: Sequelize.UUID,
        allowNull: true, // Safeguards history log if structural layout configs are dropped
        references: {
          model: 'form_configurations',
          key: 'config_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Cleans up history logs only if the entire tenant client is purged
      },
      module_code: {
        type: Sequelize.UUID,
        allowNull: true, // Safeguards history log if feature modules are altered
        references: {
          model: 'modules',
          key: 'module_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      archived_meta: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      archived_options: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null
      },
      action_type: {
        type: Sequelize.STRING(50),
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

    // Multi-tenant audit trail tracking index
    await queryInterface.addIndex('delete_histories', ['client_code', 'module_code'], {
      name: 'idx_delete_histories_secure_lookup'
    });

    // Composite historical find index
    await queryInterface.addIndex('delete_histories', ['config_code', 'key'], {
      name: 'idx_delete_histories_composite_find'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('delete_histories');
  }
};
