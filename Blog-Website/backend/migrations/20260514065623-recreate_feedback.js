'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Feedbacks', {
      feedback_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      blog_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'BlogPosts', key: 'blog_id' },
        onDelete: 'CASCADE'
      },
      feedback_given_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' }
      },
      feedback_content: {
        type: Sequelize.TEXT,
        allowNull: false
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
    await queryInterface.dropTable('Feedbacks');
  }
};
