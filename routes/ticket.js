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
  .get('/my-booking/:userId', authenticationToken, async (req, res) => {
    try {
      const myBookings = await User.findOne({
        where: {
          id: req.params.userId
        },
        include: {
          model: Ticket,
          as: 'tickets',
          include: {
            model: Schedule,
            as: 'schedule'
          }
        }
      })

      if (myBookings.tickets.length < 1) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Bookings not found!'
        })
      }

      return res.status(200).json({
        status: 'Success',
        message: 'Bookings found!',
        myBookings
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .get('/history/:userId', authenticationToken, async (req, res) => {
    try {
      const history = await User.findOne({
        where: {
          id: req.params.userId
        },
        include: {
          model: Ticket,
          as: 'tickets',
          include: {
            model: Schedule,
            as: 'schedule'
          }
        }
      })

      if (history.tickets.length < 1) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Bookings not found!'
        })
      }

      return res.status(200).json({
        status: 'Success',
        message: 'Bookings found!',
        history
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .get('/booking-detail/:ticketId', authenticationToken, async (req, res) => {
    try {
      const booking = await Ticket.findOne({
        where: {
          id: req.params.ticketId
        },
        include: {
          model: Schedule,
          as: 'schedule'
        }
      })

      if (!booking) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Booking not found!'
        })
      }

      return res.status(200).json({
        status: 'Success',
        message: 'Booking found!',
        booking
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .delete('/history/:ticketId', authenticationToken, async (req, res) => {
    try {
      const booking = await Ticket.findOne({
        where: {
          id: req.params.ticketId
        },
        include: {
          model: Schedule,
          as: 'schedule'
        }
      })

      if (!booking) {
        return res.status(404).json({
          status: 'Failed',
          message: 'History not found!'
        })
      }

      await Ticket.destroy({ where: { id: req.params.ticketId } })

      return res.status(200).json({
        status: 'Success',
        message: 'History deleted!'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })