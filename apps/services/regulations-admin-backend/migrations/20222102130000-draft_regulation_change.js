'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'draft_regulation_change',
          'dropped',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('draft_regulation_change', 'dropped', {
          transaction: t,
        }),
      ]),
    )
  },
}
