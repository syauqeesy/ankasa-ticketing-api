const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const unique = uuidv4()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, unique + '-' + file.originalname)
  }
})

const limit = {
  fileSize: 1500000
}

const fileFilter = function (req, file, callback) {
  if (file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/png') {
    return callback(null, true)
  }

  return req.res.status(400).send({
    status: 'Failed',
    message: 'Avatar must be an image'
  })
}

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
  limits: limit
})

module.exports = {
  uploadMulter: upload
}
