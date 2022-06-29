"use strict";

const productsDB = require('../../data/productsDataBase.json')

const products = productsDB.map(product => {
  return {
    ...product,
    createdAt : new Date()
  }
})

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", products, {}); // 'Categories' nombre de la tabla en la migracion
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};