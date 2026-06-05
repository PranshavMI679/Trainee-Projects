'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
        allowNull: false,
        unique: true
      },
      client_code: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_code'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      middle_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forms');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_forms_gender";');
  }
};
