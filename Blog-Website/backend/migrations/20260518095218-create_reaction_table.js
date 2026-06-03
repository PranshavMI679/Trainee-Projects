'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Create the structural layout of the Reactions table
    await queryInterface.createTable('Reactions', {
      reaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      blog_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'CASCADE' // Deletes the reaction automatically if the blog is deleted
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'CASCADE' // Deletes the reaction automatically if the user is deleted
      },
      reaction_type: {
        type: Sequelize.ENUM('heart', 'thumbs_up', 'smile', 'clap', 'party'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Database level default timestamp
      }
    });

    // 2. Add the multi-column composite unique constraint
    await queryInterface.addConstraint('Reactions', {
      fields: ['blog_id', 'user_id'],
      type: 'unique',
      name: 'unique_user_blog_reaction' // Clear, intentional index name for Postgres
    });
  },

  async down (queryInterface, Sequelize) {
    // 1. Drop the table structure completely
    await queryInterface.dropTable('Reactions');

    // 2. Remove the custom ENUM type from PostgreSQL engine memory to prevent future creation conflicts
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reactions_reaction_type";');
  }
};
