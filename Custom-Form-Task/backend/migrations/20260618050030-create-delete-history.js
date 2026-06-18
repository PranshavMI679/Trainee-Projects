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
        allowNull: false
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false
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
        allowNull: false,
        defaultValue: false
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      section_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      section_order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      area_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      area_order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      field_order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      archived_options: {
        type: Sequelize.JSONB,
        allowNull: false
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

    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_del_hist_config_code;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_del_hist_client_id;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_del_hist_composite_lookup;`);

    await queryInterface.addIndex('delete_histories', ['config_code'], {
      name: 'idx_del_hist_config_code'
    });
    
    await queryInterface.addIndex('delete_histories', ['client_id'], {
      name: 'idx_del_hist_client_id'
    });
    
    await queryInterface.addIndex('delete_histories', ['config_code', 'key'], {
      name: 'idx_del_hist_composite_lookup'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('delete_histories');
  }
};
