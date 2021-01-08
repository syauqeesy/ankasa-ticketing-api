const { Schedule, Facility, Ticket, User } = require('../models')
const { Op } = require('sequelize')
const router = require('express').Router()
const authenticationToken = require('../helpers/authentificationToken')

module.exports = router
  .post('/', authenticationToken, async (req, res) => {
    try {
      const { scheduleId, userId, title, fullName, nationality, travelInsurance } = req.body
      
      const schedule = await Schedule.findOne({
        where: {
          id: scheduleId
        },
        include: {
          model: Facility,
          as: 'facilities'
        }
      })

      if (!schedule) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Schedule not found'
        })
      }

      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!user) {
        return res.status(404).json({
          status: 'Failed',
          message: 'User not found'
        })
      }

      const ticket = await Ticket.create({ scheduleId, userId, title, fullName, nationality, travelInsurance: travelInsurance || 'No' })

      return res.status(201).json({
        status: 'Success',
        message: 'Create ticket success',
        ticket
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })