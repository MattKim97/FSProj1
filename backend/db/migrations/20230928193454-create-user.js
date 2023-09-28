'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true    
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true        
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false

      },
      firstName: {
        type: Sequelize.STRING(30),
      },
      lastName: {
        type: Sequelize.STRING(30),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },options);

    await queryInterface.addIndex('Users', {
      fields: ['username'],
      name: 'index_on_username'
    },options);
    await queryInterface.addIndex('Users', {
      fields: ['email'],
      name: 'index_on_email'
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Users";

    await queryInterface.removeIndex('Users', 'index_on_username');

    await queryInterface.removeIndex('Users', 'index_on_email');

    return queryInterface.dropTable(options);

  }
};
