'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // This forces Postgres to drop the table and all its foreign key constraints
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Reactions" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reactions_reaction_type";');
  },

  down: async (queryInterface, Sequelize) => {
    // Left blank because you cannot undo a hard cascade drop
  }
};
