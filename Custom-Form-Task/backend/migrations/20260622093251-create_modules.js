'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('modules', {
      module_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      module_code: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'client_code' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      module_name: {
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

    await queryInterface.addIndex('modules', ['client_code'], { name: 'idx_modules_secure_client_lookup' });
    await queryInterface.addIndex('modules', ['module_code'], { name: 'idx_modules_secure_code_lookup' });
    await queryInterface.addIndex('modules', ['client_code', 'module_name'], {
      unique: true,
      name: 'uidx_modules_client_name_collision'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('modules');
  }
};
