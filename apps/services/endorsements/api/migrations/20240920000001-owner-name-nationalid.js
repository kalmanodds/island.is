module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename 'owner' to 'ownerNationalId'
    await queryInterface.renameColumn('endorsement_list', 'owner', 'owner_national_id');

    // Add 'ownerName' column
    await queryInterface.addColumn('endorsement_list', 'owner_name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rename 'ownerNationalId' back to 'owner'
    await queryInterface.renameColumn('endorsement_list', 'owner_national_id', 'owner');

    // Remove 'ownerName' column
    await queryInterface.removeColumn('endorsement_list', 'owner_name');
  }
};
