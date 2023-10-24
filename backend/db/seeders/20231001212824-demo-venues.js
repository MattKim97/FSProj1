'use strict';

const { Venue } = require('../models');


/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: 'Demolition street 101010',
        city: 'Demolition City',
        state: 'Demolition state', 
        lat: 90.90,
        lng: 90.90,
      },
      {
        groupId: 2,
        address: 'FakeUser1 ',
        city: 'FakeUser1 City',
        state: 'FakeUser1 state', 
        lat: 100.10,
        lng: 100.10,
      },
      {
        groupId: 3,
        address: 'DemoUser ',
        city: 'DemoUser City',
        state: 'DemoUser state', 
        lat: 111.10,
        lng: 111.10,
      },

    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});
  }
};
