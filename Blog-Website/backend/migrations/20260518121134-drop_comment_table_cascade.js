'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Force-drop the Comments table and clear any foreign keys pointing to it (like in the Reactions table)
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Comments" CASCADE;');
  },

  down: async (queryInterface, Sequelize) => {
    // Left blank because you cannot undo a destructive cascade drop command
  }
};
