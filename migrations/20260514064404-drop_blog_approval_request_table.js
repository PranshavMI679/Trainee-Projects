module.exports = {
  async up (queryInterface, Sequelize) {
    // Replace with exact table name spelling from pgAdmin
    await queryInterface.dropTable('BlogApprovalRequests', { cascade: true });
  },
  async down (queryInterface, Sequelize) {}
};
