'use strict';
const { EventImage } = require('../models');
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'https://www.islingtontribune.co.uk/media/2010/01/inews011510_09.jpg',
        preview: true,
      },
      {
        eventId: 2,
        url: 'https://m.media-amazon.com/images/I/71lFKEZO2RL._AC_UY1000_.jpg',
        preview: true,
      },
      {
        eventId: 3,
        url: 'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/9/1/1441105712368/e7b61a7e-bb2d-4d3c-a6c5-ccb49803c71b-2060x1236.jpeg?width=700&quality=85&auto=format&fit=max&s=b4ad53cd8279ccef65ec495b2e6a86c5',
        preview: true,
      },
    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1,2] }
    }, {});
  }
};
