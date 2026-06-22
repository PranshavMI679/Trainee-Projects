'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('forms', {
      employee_code: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'client_code' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      module_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'modules', key: 'module_code' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      custom_values: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('forms', ['client_code', 'module_code', 'employee_code'], { name: 'idx_forms_secure_entity_lookup' });
    await queryInterface.addIndex('forms', ['custom_values'], { name: 'idx_forms_custom_values_gin', using: 'gin' });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('forms');
  }
};
