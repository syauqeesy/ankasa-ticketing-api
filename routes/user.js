const { User } = require('../models')
const router = require('express').Router()

module.exports = router
  .post('/register', async (req, res) => {
    try {
      // const users = await User.findAll()
      // const user = await User.create({ name: req.body.name, email: req.body.email })
      // const user = await User.findOne({ where: { id: req.params.id } })
      // const users = await User.findAll({ where: { name: req.query.keyword } })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
