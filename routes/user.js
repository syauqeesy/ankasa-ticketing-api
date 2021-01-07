const { User } = require('../models')
const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadMulter } = require('../middlewares/upload')

module.exports = router
  .post('/register', async (req, res) => {
    try {
      const { fullName, email, password } = req.body

      const data = await User.findOne({ where: { email: req.body.email } })
      if (data){
        res.status(400).json({
          status: 'Failed',
          message: 'email already exists'
        })
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            User.create({ fullName: fullName, email: email, password: hash, createdAt: new Date() })
            return res.status(200).json({
              status: 'Success',
              message: 'Register success'
            })
          })
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .post('/login', async (req, res) => {
    try {
      const data = await User.findOne({ where: { email: req.body.email } })
      if (!data){
        res.json({
          message: 'Email not found'
        })
      } else (
        
        bcrypt.compare(req.body.password, data.password, function (err, resCheck) {
          if (!resCheck) {
            res.status(401).json({
              status: 'Failed',
              message: 'Password Wrong'
            })
          }

          jwt.sign({ idUser: data.id, email: data.email }, process.env.SECRET_KEY, { expiresIn: '24h' }, function (err, token) {
            const dataLogin = {
              id: data.id,
              email: data.email,
              token: token
            }
            res.status(200).json({
              status: 'Success',
              message: 'Login Success',
              data: dataLogin
            })
          })
        })
      )
    } catch(error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!',
      })
    }
  })
  .get('/:idUser', async (req, res) => {
    try {
      const data = await User.findOne({ where: { id: req.params.idUser } })
      return res.status(200).json({
        status: 'Success',
        data: data
      })
    } catch(error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!',
      })
    }
  })
  .patch('/:idUser', uploadMulter.single('avatar'), async (req, res) => {
    try {
      const id = req.params.idUser
      const checkId = await User.findOne({ where: { id: id } })
      if (!checkId){
        return res.status(404).json({
          status: 'Failed',
          message: 'ID User not Found'
        })
      }

      const { email, phoneNumber, fullName, city, address, postCode } = req.body
      await User.update({ avatar: `${process.env.BASE_URL}/upload/${req.file.filename}`, fullName: fullName, email: email, phoneNumber: phoneNumber, city: city, address: address, postCode: postCode, updatedAt: new Date()}, {where: {id: id}})
      res.status(200).json({
        status: 'Success',
        message: 'Data user has been updated'
      })
    } catch(error){
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!',
      })
    }
  })
