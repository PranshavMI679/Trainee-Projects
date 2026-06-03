'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // This line completely deletes the table using its pgAdmin name
    await queryInterface.dropTable('BlogPosts', { cascade: true });
  },

  async down (queryInterface, Sequelize) {
    // Leave blank because we are dropping and recreating completely
  }
};
