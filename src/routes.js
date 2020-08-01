const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer') //multer para adicionar arquivos
const ProductController = require('./app/controllers/ProductController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')
//Home
routes.get('/',HomeController.index)

//Search
routes.get('/products/search', SearchController.index)

//Products
routes.get('/products/create', ProductController.create)
routes.get('/products/:id',ProductController.show)
routes.get('/products/:id/edit',ProductController.edit)
routes.post('/products',multer.array("photos",6), ProductController.post) //colocando multer para poder mexer com fotos. o 6 é o limite !
routes.put('/products',multer.array("photos",6),ProductController.put)
routes.delete('/products',ProductController.delete)


//Alias
routes.get('/ads/create', (req, res) => {
  return res.render('products/create')
})


module.exports = routes