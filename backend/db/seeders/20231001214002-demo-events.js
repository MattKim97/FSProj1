'use strict';
const { Event } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'Demolition Event',
        description: 'We are literally going to demolish things',
        type: 'In person',
        capacity: 90,
        price: 55,
        startDate: '10/1/2024 07:00:00',
        endDate: '10/2/2024 12:00:00',
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'FakeUser1 Event',
        description: 'We are literally just a bunch of fakers',
        type: 'Online',
        capacity: 100,
        price: 20,
        startDate: '1/1/2024 07:00:00',
        endDate: '1/3/2024 12:00:00',
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Demolition Event 2',
        description: 'We are literally going to demolish things again but this time I am making my description like super super long so I can see how the description wraps around I wonder if frogs can smell through their skin?',
        type: 'In person',
        capacity: 90,
        price: 55,
        startDate: '11/10/2024 10:00:00',
        endDate: '11/11/2024 20:00:00',
      }
    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});
  }
};
