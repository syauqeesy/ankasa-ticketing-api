const { Schedule, Facility } = require('../models')
const router = require('express').Router()

module.exports = router
  .post('/create', async (req, res) => {
    try {
      const { airline, airlineClass, code, terminal, gate, from, to, departureTime, arrivedTime, price, transit, facilities } = req.body
      let airlineLogo = airline + '.png'

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
      res.status(500).json({
        status: 'Failed',
        message: 'Internal server error'
      })
    }
  })