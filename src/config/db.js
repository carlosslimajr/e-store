//fazendo a conexão com o banco de dados !
const {Pool} = require('pg') //desestruturando do pg !
//o bd sempre precisa enviar,verificar tudo,pesquisas e querys
//com o pool só precisa de uma config e n precisa mais, para facilitar o processo !,deixando autorizado!
module.exports = new Pool({
  user:'postgres',
  password:"051971",
  host:"localhost",
  port:5432,
  database:"launchstoredb"
})