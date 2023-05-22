/* eslint-disable no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Customers', [
      {
        firstName: 'Roronoa',
        lastName: 'Zoro',
        email: 'roronoazoro@gmail.com',
        phone: '087786765565',
        password: 'asdfghjkl',
        addressId: 3,
        picture: 'zoro-profile.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    // await queryInterface.bulkDelete('Customers', null, {});
  },
};
