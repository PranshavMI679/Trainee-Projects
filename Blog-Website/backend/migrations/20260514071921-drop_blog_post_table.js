'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Drops the table even if other tables depend on its foreign keys
    await queryInterface.dropTable('BlogPosts', { cascade: true });
  },

  async down (queryInterface, Sequelize) {
    // Leave blank because you are completely changing the model structure anyway
  }
};
