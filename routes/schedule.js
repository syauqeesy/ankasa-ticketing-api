const { Schedule, Facility } = require('../models')
const { Op } = require('sequelize')
const router = require('express').Router()
const moment = require('moment')
const authenticationToken = require('../helpers/authentificationToken')
const verifyRole = require('../helpers/verifyRole')

module.exports = router
  .post('/create', [authenticationToken, verifyRole], async (req, res) => {
    try {
      const { airline, airlineClass, code, terminal, gate, from, to, departureTime, arrivedTime, price, transit, facilities } = req.body
      const airlineLogo = airline + '.png'

      const schedule = await Schedule.create({ airlineLogo, airline, airlineClass, code, terminal, from, to, departureTime, gate, arrivedTime, price, transit })

      facilities.forEach(async facility => {
        await Facility.create({ scheduleId: schedule.id, facility })
      })

      return res.status(200).json({
        status: 'Success',
        message: 'Create schedule success!'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error'
      })
    }
  })
  .get('/', [authenticationToken], async (req, res) => {
    try {
      const index = parseInt(req.query.page) || 1
      const numOfSchedules = await Schedule.findAll({
        where: {
          departureTime: {
            [Op.between]: [moment(new Date()).format('YYYY-MM-DD hh:mm:ss'), '9999-12-31 00:00:00']
          }
        }
      })
      const schedules = await Schedule.findAll({
        where: {
          departureTime: {
            [Op.between]: [moment(new Date()).format('YYYY-MM-DD hh:mm:ss'), '9999-12-31 00:00:00']
          },
          to: {
            [Op.like]: `%${req.query.keyword || ''}%`
          },
          airline: {
            [Op.like]: `%${req.query.airline || ''}%`
          },
          transit: {
            [Op.like]: `%${req.query.transit || ''}%`
          }
        },
        include: {
          model: Facility,
          as: 'facilities',
          where: {
            facility: {
              [Op.like]: `%${req.query.facility || ''}%`
            }
          }
        },
        limit: 10,
        offset: index * 10 - 10
      })

      if (schedules.length < 1) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Schedules not found'
        })
      }

      const whereClause = []

      for (schedule of schedules) {
        whereClause.push({ id: schedule.id })
      }

      const data = await Schedule.findAll({
        where: {
          [Op.or]: whereClause
        },
        include: {
          model: Facility,
          as: 'facilities'
        }
      })

      if (data.length < 1) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Schedules not found'
        })
      }



      return res.status(200).json({
        status: 'Success',
        message: 'Schedules data fetched',
        schedules: data,
        pagination: {
          previousPage: index - 1 > 0 ? index - 1 : null,
          currentPage: index,
          nextPage: index + 1 <= Math.ceil(parseInt(numOfSchedules.length) / 10) ? index + 1 : null
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error'
      })
    }
  })
  .get('/:scheduleId', [authenticationToken], async (req, res) => {
    try {
      const schedule = await Schedule.findOne({
        where: {
          id: req.params.scheduleId
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

      return res.status(200).json({
        status: 'Success',
        message: 'Schedule data fetched',
        schedule
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error'
      })
    }
  })
