'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Force-drop old table variations and clear existing ENUM types to avoid conflicts
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Reactions" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reactions_reaction_type";');

    // 2. Build the Reactions table schema layout
    await queryInterface.createTable('Reactions', {
      reaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      blog_id: {
        type: Sequelize.UUID,
        allowNull: false, // Strictly required for all rows
        references: {
          model: 'BlogPosts', // Matches your physical BlogPost table name
          key: 'blog_id'
        },
        onDelete: 'CASCADE'
      },
      comment_id: {
        type: Sequelize.UUID,
        allowNull: true, // Nullable: only filled when reacting directly to comments
        references: {
          model: 'Comments', // Matches your physical Comment table name
          key: 'comment_id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Matches your physical User table name
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      reaction_type: {
        type: Sequelize.ENUM('heart', 'thumbs_up', 'smile', 'clap', 'party'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 3. INDEX 1: Unique partial index for direct blog reactions (where comment_id IS NULL)
    await queryInterface.addIndex('Reactions', ['blog_id', 'user_id'], {
      unique: true,
      name: 'unique_user_blog_direct_reaction',
      where: {
        comment_id: null
      }
    });

    // 4. INDEX 2: Unique index for specific comments on that blog post
    await queryInterface.addIndex('Reactions', ['blog_id', 'comment_id', 'user_id'], {
      unique: true,
      name: 'unique_user_comment_reaction'
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop execution sequence for rollback actions
    await queryInterface.dropTable('Reactions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reactions_reaction_type";');
  }
};
