'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupImage.init({
    groupId:{
      type:DataTypes.INTEGER
    },
    url: {
      type:DataTypes.STRING
    },
    preview: {
      type:DataTypes.BOOLEAN
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
