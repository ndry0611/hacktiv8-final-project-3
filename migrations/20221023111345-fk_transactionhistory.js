'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Transactionhistories", "ProductId", {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn("Transactionhistories", "UserId", {
      type: Sequelize.INTEGER
    });

    await queryInterface.addConstraint("Transactionhistories", {
      fields: ['ProductId'],
      type: 'foreign key',
      name: 'fk_Transactionhistories_ProductId_ref_Products_id',
      references: {
        table: "Products",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });

    await queryInterface.addConstraint("Transactionhistories", {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'fk_Transactionhistories_UserId_ref_Users_id',
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("Transactionhistories","fk_Transactionhistories_ProductId_ref_Products_id");
    await queryInterface.removeConstraint("Transactionhistories","fk_Transactionhistories_UserId_ref_Users_id");
    await queryInterface.removeColumn("Transactionhistories", "ProductId");
    await queryInterface.removeColumn("Transactionhistories", "UserId");
  }
};
