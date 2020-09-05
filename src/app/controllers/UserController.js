const User = require('../models/User')
const {formatCep,formatCpfCnpj} = require('../../lib/utils')
console.log('chegou até aqui')
console.log(User)


module.exports = {
  registerForm(req, res) {
    
   
    return res.render("user/register")
  },
  async show(req,res){
    const{user} = req //pegando lá do validador/middleware
    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
    user.cep = formatCep(user.cep)

    return res.render('user/index', {user})
  },
  async post(req,res){
    try{
      const userId = await User.create(req.body)
      req.session.userId = userId
      return res.redirect('/users')
    } catch(err){
      console.error(err)
      return res.send('Deu ruim')
    }
   
  
  },
  async update(req,res){
    try{

      let{name,email,cpf_cnpj,adress,cep,id} = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
      cep = cep.replace(/\D/g,"")

      await User.update(id,{
        name,
        email,
        cpf_cnpj,
        cep,
        adress
      })

      return res.render("user/index",{
        user:req.body,
        sucess:"Conta atualizada com sucesso!"
      })

    }catch(err){
      console.error(err)
      return res.render("user/index",{
        error:"Algum erro aconteceu!",
        user:req.body
      })
    }
  }
}