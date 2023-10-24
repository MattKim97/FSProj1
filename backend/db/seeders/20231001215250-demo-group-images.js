'use strict';

const { GroupImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Operation_Upshot-Knothole_-_Badger_001.jpg',
        preview: true,
      },
      {
        groupId: 2,
        url: 'https://whyy.org/wp-content/uploads/2019/08/bigstock-Rubber-Stamp-And-Word-Fake-Pri-272426671-768x512.jpg',
        preview: false,
      },
      {
        groupId: 3,
        url: 'https://cdn-icons-png.flaticon.com/512/5110/5110617.png',
        preview: true,
      },
    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});

  }
};
