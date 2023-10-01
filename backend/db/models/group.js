'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks:true
      })
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks:true
      })
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks:true
      })
    }
  }
  Group.init({
    organizerId: {
      type:DataTypes.INTEGER
    },
    name: {
      type:DataTypes.STRING
    },
    about: {
      type:DataTypes.TEXT
    },
    type: {
      type:DataTypes.ENUM
    },
    private: {
      type:DataTypes.BOOLEAN
    },
    city: {
      type:DataTypes.STRING
    },
    state: {
      type:DataTypes.STRING
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
