const express = require('express')
const mongoose = require('mongoose')

const sauceRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')
const path = require('path')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  )
  next()
})

mongoose
  .connect(
    'mongodb+srv://filipa:passwordforpojectone@project-one.nlzh79e.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!')
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!')
    console.error(error)
  })

//handle POST requests; app.use intercepts json types
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

//to access outside this file
module.exports = app
