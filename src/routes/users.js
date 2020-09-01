const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user') //isso aqui é um middleware
const SessionValidator = require('../app/validators/session') //isso aqui é um middleware
const {isLoggedRedirectToUsers,onlyUsers} = require('../app/middlewares/session')

//Login/Logout 
//->rota para mostrar formulario de login
routes.get('/login' ,isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login',SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// //Reset password /forgot
routes.get('/forgot-password' , SessionController.forgotForm)
routes.get('/password-reset' , SessionController.resetForm)
routes.post('/forgot-password',SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset',SessionValidator.reset, SessionController.reset)

//user Register

routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

routes.get('/',onlyUsers,UserValidator.show, UserController.show)
routes.put('/',UserValidator.update, UserController.update)
// routes.delete('/', UserController.delete)
// //Criação
//atualização
//remoção


module.exports = routes
