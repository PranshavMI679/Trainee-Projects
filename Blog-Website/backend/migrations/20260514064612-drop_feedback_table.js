'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Match your exact Feedback table name from pgAdmin
    await queryInterface.dropTable('Feedbacks', { cascade: true });
  },

  async down (queryInterface, Sequelize) {}
};
