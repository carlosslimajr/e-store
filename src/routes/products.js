const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer') 
const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')

const {onlyUsers} = require('../app/middlewares/session') //verificando se esta logado

//Search
routes.get('/search', SearchController.index)

/
routes.get('/create', onlyUsers, ProductController.create)
routes.get('/:id',ProductController.show)
routes.get('/:id/edit',onlyUsers,ProductController.edit)


routes.post('/',onlyUsers,multer.array("photos",6), ProductController.post) //colocando multer para poder mexer com fotos. o 6 é o limite !
routes.put('/',onlyUsers,multer.array("photos",6),ProductController.put)
routes.delete('/',onlyUsers,ProductController.delete)


module.exports = routes