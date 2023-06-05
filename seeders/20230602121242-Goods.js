const {faker} = require('@faker-js/faker')
'use strict';

const categoryArray = [
  'Men',
  'Women',
  'Kids',
  'Accessories',
  'Perfume',
]
const subcategoryArray = [
  'Shoes',
  'Outerwear', //Верхняя одежда'
  'Bags',
  'Underwear',
]
const sizeArray = [
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Goods', 
      //Создаём массив где будут ~100 записей
      [...Array(50)].map(() => ({
        name: faker.lorem.sentence(2),
        description: faker.lorem.sentence(10),
        price: faker.random.numeric(4),
        size: 
          sizeArray[
            Math.floor(Math.random() * categoryArray.length)
          ],
        image: JSON.stringify(
          [...Array(4)].map(
            () => `${faker.image.fashion()}?random=${faker.random.numeric(30)}`
            ),
          ),
        quantity: faker.random.numeric(2),
        category:
          categoryArray[
            Math.floor(Math.random() * categoryArray.length)
          ],
        subcategory:
          subcategoryArray[
            Math.floor(Math.random() * subcategoryArray.length)
          ],
        bestseller: faker.datatype.boolean(), 
        new: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date()
        })
      )
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Goods', null, {});  //*Для отката миграции
  }
};
