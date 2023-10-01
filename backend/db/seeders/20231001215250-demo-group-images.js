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
        url: 'demolitiongroupimages.com',
        preview: false,
      },
      {
        groupId: 2,
        url: 'fakeuser1groupimages.com',
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
