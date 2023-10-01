'use strict';
const { Attendance } = require('../models');


/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: 'In Person'
      },
      {
        eventId: 2,
        userId: 2,
        status: 'Online'
      },
      {
        eventId: 2,
        userId: 3,
        status: 'Online'
      },

    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2,3] }
    }, {});
  }
};