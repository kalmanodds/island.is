'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('program_search_group',
          {
            program_id: {
              type: Sequelize.UUID,
              references: {
                model: 'program',
                key: 'id',
              },
              allowNull: false,
            },
           search_group_id: {
              type: Sequelize.UUID,
              references: {
                model: 'search_group',
                key: 'id',
              },
              allowNull: false,
            },
          },
          { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('program_search_group', { transaction: t }),
      ]);
    });
  }
};