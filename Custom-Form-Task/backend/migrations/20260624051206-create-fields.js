'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fields', {
      field_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      field_code: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      area_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'section_areas',
          key: 'area_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      field_order: {
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

    await queryInterface.addIndex('fields', ['area_code'], {
      name: 'idx_fields_parent_uuid_lookup'
    });

    await queryInterface.addIndex('fields', ['area_code', 'field_order'], {
      name: 'idx_fields_sorting_grid_v3'
    });

    await queryInterface.addIndex('fields', ['area_code', 'key'], {
      unique: true,
      name: 'uidx_area_field_key_collision'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fields');
  }
};
