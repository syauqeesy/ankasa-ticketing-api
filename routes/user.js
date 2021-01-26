const { User } = require('../models')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const { uploadMulter } = require('../middlewares/upload')
const authenticationToken = require('../helpers/authentificationToken')
const sendEmailForgotPassword = require('../helpers/sendEmailForgotPassword')

const upload = (req, res, next) => {
  const handleUpload = uploadMulter.single('avatar')
  handleUpload(req, res, error => {
    if (error instanceof multer.MulterError) {
      return res.status(400).send({
        status: 'Failed',
        message: error.message
      })
    }

    if (error) {
      return res.status(500).send({
        status: 'Failed',
        message: 'Internal server error'
      })
    }
    next()
  })
}

module.exports = router
  .post('/register', async (req, res) => {
    try {
      const { fullName, email, password } = req.body

      const data = await User.findOne({ where: { email: req.body.email } })
      if (data) {
        res.status(400).json({
          status: 'Failed',
          message: 'email already exists'
        })
      } else {
        bcrypt.genSalt(10, function (_err, salt) {
          bcrypt.hash(password, salt, function (_err, hash) {
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
      if (!data) {
        res.json({
          message: 'Email not found'
        })
      } else {
        (
          bcrypt.compare(req.body.password, data.password, function (_err, resCheck) {
            if (!resCheck) {
              res.status(401).json({
                status: 'Failed',
                message: 'Password Wrong'
              })
            }

            jwt.sign({ idUser: data.id, email: data.email, role: data.role }, process.env.SECRET_KEY, { expiresIn: '24h' }, function (_err, token) {
              const dataLogin = {
                id: data.id,
                email: data.email,
                role: data.role,
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
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .get('/:idUser', authenticationToken, async (req, res) => {
    try {
      const data = await User.findOne({ where: { id: req.params.idUser } })
      return res.status(200).json({
        status: 'Success',
        data: { ...data.dataValues, avatar: `${process.env.BASE_URL}/images/${data.avatar}` }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .patch('/:idUser', authenticationToken, upload, async (req, res) => {
    try {
      const id = req.params.idUser
      const checkId = await User.findOne({ where: { id: id } })
      if (!checkId) {
        return res.status(404).json({
          status: 'Failed',
          message: 'ID User not Found'
        })
      }

      let avatar = checkId.avatar
      if (req.file) {
        avatar = req.file.filename
      }

      const { email, phoneNumber, fullName, city, address, postCode } = req.body
      await User.update({ avatar: `${avatar}`, fullName: fullName || checkId.fullName, email: email || checkId.email, phoneNumber: phoneNumber || checkId.phoneNumber, city: city || checkId.city, address: address || checkId.address, postCode: postCode || checkId.postCode, updatedAt: new Date() }, { where: { id: id } })
      res.status(200).json({
        status: 'Success',
        message: 'Data user has been updated'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
  .post('/forgotpassword', async (req, res) => {
    try {
      const data = await User.findOne({ where: { email: req.body.email } })
      if (!data) {
        res.json({
          message: 'Email not found'
        })
      } else {
        const idUser = data.id
        const email = data.email
        const fullName = data.fullName
        sendEmailForgotPassword(email, idUser, fullName)
        res.status(200).json({
          status: 'Success',
          Message: 'Send mail success'
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
  .patch('/changepassword/:idUser', async (req, res) => {
    try {
      const id = req.params.idUser
      const checkId = await User.findOne({ where: { id: id } })
      if (!checkId) {
        return res.status(404).json({
          status: 'Failed',
          message: 'ID User not Found'
        })
      }
      bcrypt.genSalt(10, function (_, salt) {
        bcrypt.hash(req.body.password, salt, function (_, hash) {
          User.update({ password: hash, updatedAt: new Date() }, { where: { id: id } })
          return res.status(200).json({
            status: 'Success',
            message: 'Password has been updated'
          })
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error!'
      })
    }
  })
