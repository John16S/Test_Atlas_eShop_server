'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Goods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING(2048)
      },
      price: {
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING(2048)
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      subcategory: {
        type: Sequelize.STRING
      },
      bestseller: {
        type: Sequelize.BOOLEAN
      },
      new: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Goods');
  }
};