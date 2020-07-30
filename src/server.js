const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes') // Todas as rotas estou puxando de outro arquivo para n ficar mto extenso!
const server = express() //estou iniciando o express que agora é uma função
const path = require('path')
const methodOverride = require('method-override')

//Middlewares !
server.use(express.urlencoded({extended: true}))//n sei oq é isso
server.use(express.static('public'))//Usando a pasta public para puxar os estilos/js
server.use(methodOverride('_method'))//puxando o methodoverride
server.use(routes) //Puxando as rotas

//essa linha faz funcionar o req.body. outro middleware

server.set("view engine", "njk")//Tornando padrão do server para não precisar ficar colocando .html/.njk

nunjucks.configure("src/app/views", {
  express: server, //nome da variavel
  autoescape: false,
  noCache: true
  //Aqui estou configurando o nunjucks, template engine para tornar mais simpples a montagens dos sites!
})
server.listen(5000, () => {
  console.log("server is running")
})