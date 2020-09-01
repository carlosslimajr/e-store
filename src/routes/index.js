const express = require('express')
const routes = express.Router()
//multer para adicionar arquivos
const HomeController = require('../app/controllers/HomeController')

const products = require('./products')
const users = require('./users')

 //coloando /users na frente de tudo

//Home
routes.get('/',HomeController.index)
routes.use('/products',products)
routes.use('/users', users)

//Alias -> Atalhos
routes.get('/ads/create', (req, res) => {
  return res.render('products/create')
})

routes.get('/accounts', (req, res) => {
  return res.redirect('users/login')
})


module.exports = routes