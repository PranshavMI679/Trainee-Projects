'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
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
      label: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.STRING(50), allowNull: false },
      is_required: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      length: { type: Sequelize.INTEGER, allowNull: true },
      options: { type: Sequelize.JSONB, allowNull: true, defaultValue: null },
      section_name: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'General Information' },
      section_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      area_name: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'Main Group' },
      area_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      field_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('form_configs', ['config_code'], { name: 'idx_form_configs_code' });
    await queryInterface.addIndex('form_configs', ['client_code', 'module_code'], { name: 'idx_form_configs_secure_lookup' });
    await queryInterface.addIndex('form_configs', ['client_code', 'module_code', 'config_code', 'section_order', 'area_order', 'field_order'], {
      name: 'idx_form_configs_layout_sorting_v2'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('form_configs');
  }
};
