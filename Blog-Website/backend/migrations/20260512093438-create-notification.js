'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      notif_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      notif_type: {
        type: Sequelize.ENUM('messages', 'updates'),
        allowNull: false
      },
      notif_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      notif_time: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Notifications_notif_type";');
  }
};
