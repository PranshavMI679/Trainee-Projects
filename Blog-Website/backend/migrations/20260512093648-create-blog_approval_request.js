'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('BlogApprovalRequests', {
      request_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      blog_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      admin_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('approval pending', 'approved'),
        defaultValue: 'approval pending',
        allowNull: false
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('BlogApprovalRequests');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_BlogApprovalRequests_status";');
  }
};
