'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Automatically clear out any table remnants or old ENUM caches first
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "BlogPosts" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_BlogPosts_status" CASCADE;');

    // 2. Freshly construct the updated BlogPosts table structure
    await queryInterface.createTable('BlogPosts', {
      blog_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' },
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Categories', key: 'category_id' }
      },
      blog_title: {
        type: Sequelize.STRING(255), // Plain text string data type
        allowNull: false
      },
      blog_image: {
        type: Sequelize.ARRAY(Sequelize.STRING(255)), // Array wrapper for presigned image URLs
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'approval pending', 'approved', 'recheck', 'published'),
        defaultValue: 'draft',
        allowNull: false
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Users', key: 'user_id' }
      },
      rechecked_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Users', key: 'user_id' }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BlogPosts');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_BlogPosts_status" CASCADE;');
  }
};
