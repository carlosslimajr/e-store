const User = require('../models/User')
const {compare} = require('bcryptjs')
function checkAllFields(body) {
  //checar se todos os fields estão preenchidos !
  const keys = Object.keys(body)
  console.log(keys)
  for (key of keys) {
    //Verificando se algo no objeto esta vazio!
    if (body[key] == "") {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos!'
      }
    }
  }
}

async function show(req, res, next) {

  const { userId: id } = req.session //pegando direto do session

  const user = await User.findOne({ where: { id } })

  if (!user) return res.render("user/register", {
    error: "Usuário não encontrado!"
  })
  req.user = user //colocando dentro do req e pego la na frente
  next()
}
async function post(req, res, next) {
  //criando um middleware !
  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields){
    return res.render('user/register',fillAllFields)//devolvendo com erro e tudo mais
  }
  //Checar se o usuario já existe ->[email,cpf_cnpj]
  let { email, cpf_cnpj, password, passwordRepeat } = req.body
  //tirando do body para pesquisar no banco de dados

  //limpando cpfcnpj
  cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

  const user = await User.findOne({
    where: { email },
    or: { cpf_cnpj } //jogando um objeto na query
  })
  if (user) return res.render('user/register', {
    user: req.body,
    error: 'Usuário já cadastrado!'
  })

  //Check if password match !
  if (password != passwordRepeat) return res.render('user/register', {
    user: req.body,
    error: 'Senhas não batem!'
  })
  req.user = user
  next() // se passou por tudo chegou aqui
}
async function update(req, res, next) {

  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields){
    return res.render('user/index',fillAllFields)//devolvendo com erro e tudo mais
  }

  const {id,password} = req.body //checando senha!

  if(!password) return res.render("user/index",{
    user: req.body,
    error: "Coloque sua senha para atualizar o cadastro"
  })

  const user = await User.findOne({where: {id}}) //checando se id bate

  const passed = await compare(password,user.password) //comparando senhas

  if(!passed) return res.render("user/index",{
    user:req.body,
    error:"Senha incorreta"
  })
  next()

}

module.exports = {
  post,
  show,
  update
}