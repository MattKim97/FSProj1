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
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'DemoUser Event 2',
        description: 'You know what it is!!! Another demo event!!!! Used for what???? You are right! Demoing purposes!!!!',
        type: 'In person',
        capacity: 200,
        price: 10,
        startDate: '8/10/2024 10:00:00',
        endDate: '8/11/2024 20:00:00',
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'DemoUser Event',
        description: 'A Demo Event!!! for demoing purposes! So I can see the functionality of my app!',
        type: 'In person',
        capacity: 100,
        price: 15,
        startDate: '6/10/2023 10:00:00',
        endDate: '6/11/2023 20:00:00',
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
