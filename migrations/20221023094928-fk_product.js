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
    await queryInterface.addColumn("Products", "CategoryId", {
      type: Sequelize.INTEGER
    });
    await queryInterface.addConstraint("Products", {
      fields: ['CategoryId'],
      type: 'foreign key',
      name: 'fk_Products_CategoryId_ref_Categories_id',
      references: {
        table: "Categories",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("Products", "fk_Products_CategoryId_ref_Categories_id");
    await queryInterface.removeColumn("Products", "CategoryId");
  }
};
