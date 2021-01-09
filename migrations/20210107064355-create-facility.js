'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Facilities', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      scheduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Schedules',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      facility: {
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
    await queryInterface.dropTable('Facilities')
  }
}
