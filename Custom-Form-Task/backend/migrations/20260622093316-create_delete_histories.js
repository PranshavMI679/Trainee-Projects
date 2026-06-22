'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('delete_histories', {
      deletion_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      config_code: { 
        type: Sequelize.UUID, 
        allowNull: false 
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
      key: { type: Sequelize.STRING(100), allowNull: false },
      archived_meta: { type: Sequelize.JSONB, allowNull: false },
      archived_options: { type: Sequelize.JSONB, allowNull: true, defaultValue: null },
      action_type: { type: Sequelize.STRING(50), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('delete_histories', ['client_code', 'module_code'], { name: 'idx_delete_histories_secure_lookup' });
    await queryInterface.addIndex('delete_histories', ['config_code', 'key'], { name: 'idx_delete_histories_composite_find' });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('delete_histories');
  }
};
