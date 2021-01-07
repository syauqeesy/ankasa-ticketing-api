require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const { sequelize } = require('./models')

const user = require('./routes/user')

app.use('/images', express.static('./images'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', user)

app.listen(process.env.PORT, async () => {
  console.log(`Server running on port ${process.env.PORT}`)
  await sequelize.authenticate()
})
