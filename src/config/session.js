const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session({//as opções do session , olhar dps o site
  store: new pgSession({
    pool: db //aqui ja ta tudo configurado no db!
    //guardando a sessao no banco de dados
  }),
  //Chave secreta!
  secret:'teucu',
  resave:false, //Só salvar a sessão uma vez !
  saveUninitialized:false,   //salvar sem ter dados
  cookie: { //tempo da sessão
    maxAge: 30 * 24 * 60 * 60*1000  //em millisegundos, 30 dias aqui
  }
})//vai ser chamado no Usercontroller