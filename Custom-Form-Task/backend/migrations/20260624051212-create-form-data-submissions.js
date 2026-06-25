'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryInterface.createTable('form_data_submissions', {
      submission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      employee_code: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()') 
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      custom_values: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
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

    await queryInterface.addIndex('form_data_submissions', ['client_code', 'employee_code'], {
      name: 'idx_submissions_secure_identity_lookup'
    });

    await queryInterface.addIndex('form_data_submissions', ['custom_values'], {
      using: 'gin',
      name: 'idx_submissions_custom_values_gin'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('form_data_submissions');
  }
};
