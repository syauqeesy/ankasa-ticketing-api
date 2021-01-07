'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      airlineLogo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      airline: {
        type: Sequelize.STRING,
        allowNull: false
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departuretime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      arrivedTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      price: {
        type: Sequelize.STRING(9),
        allowNull: false
      },
      transit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schedules')
  }
}
