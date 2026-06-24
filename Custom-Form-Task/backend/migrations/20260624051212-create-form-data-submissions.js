'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
        references: {
          model: 'employees',
          key: 'employee_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Protects operational data from accidental employee removal
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Ensures tenant transaction logs are never accidentally orphaned
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

    // Multi-tenant employee lookup index (updated for Option B)
    await queryInterface.addIndex('form_data_submissions', ['client_code', 'employee_code'], {
      name: 'idx_submissions_secure_identity_lookup'
    });

    // PostgreSQL GIN Index for rapid deep querying inside the unstructured JSONB payload
    await queryInterface.addIndex('form_data_submissions', ['custom_values'], {
      using: 'gin',
      name: 'idx_submissions_custom_values_gin'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('form_data_submissions');
  }
};
