module.exports = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(401).json({
      status: 'Failed',
      message: 'You\'re not admin'
    })
  }

  next()
}