'use strict';
const { Group } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'Demolition Event',
        about: 'A lil group that really likes demolition I am just trying to hit a minimum of fifty characters',
        type: "In person",
        private: false,
        city: 'Demolition City',
        state: 'Demolition state', 
      },
      {
        organizerId: 2,
        name: 'Fake Event 1',
        about: 'I am just trying to hit fifty characters why is the minimum fifty characters that is low-key alot whyyyyyyyyyyyyyyyyyy',
        type: "Online",
        private: true,
        city: 'FakeUser1 City',
        state: 'FakeUser1 state', 
      },
      {
        organizerId: 4,
        name: 'Demo Group',
        about: 'This is a Demo Group because it is used for demo purposes and is used for demoing my code',
        type: "Online",
        private: false,
        city: 'DemoUser City',
        state: 'DemoUser state', 
      },

    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1,2] }
    }, {});
  }
};
