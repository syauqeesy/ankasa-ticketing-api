require('dotenv').config()
'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate ({ Facility, Ticket }) {
      // define association here
      this.hasMany(Facility, { foreignKey: 'scheduleId', as: 'facilities' })
      this.hasMany(Ticket, { foreignKey: 'scheduleId', as: 'tickets' })
    }
    toJSON () {
      return { ...this.get(), airlineLogo: `${process.env.BASE_URL}/images/${this.getDataValue('airlineLogo')}` }
    }
  }
  Schedule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    airlineLogo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airlineClass: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    terminal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrivedTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    transit: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Schedule'
  })
  return Schedule
}
