'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Forcefully drop the table and instantly break all active foreign key constraints
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Comments" CASCADE;');

    // 2. Re-create the clean table structure matching your exact model layout
    await queryInterface.createTable('Comments', {
      comment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      blog_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      parent_comment_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      comment_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop the table cleanly on rollback
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Comments" CASCADE;');
  }
};
