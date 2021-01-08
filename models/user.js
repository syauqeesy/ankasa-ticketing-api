'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'user_default.jpg',
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(13),
      defaultValue: '081234567890',
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: 'Your City',
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: 'Your Address',
      allowNull: false
    },
    postCode: {
      type: DataTypes.STRING,
      defaultValue: '00000',
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'User',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}
