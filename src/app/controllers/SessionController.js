const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const {hash} = require('bcryptjs')
module.exports = {
  registerForm(req, res) {
    return res.render("user/register")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    //verificar se o usuario esta cadastrado

    //verificar se o password bate

    //
    req.session.userId = req.user.id
    return res.redirect("/users")

  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    const user = req.user

    try {
      //Criar um token para o usuario
      const token = crypto.randomBytes(20).toString("hex")
      //Criar uma expiração do token
      let now = new Date()
      now = now.setHours(now.getHours() + 1) //Somente uma hora

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })
      //enviar um email com um link de recuperação de senha !
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Recuperação de senha',
        html: `
      <h2>Perdeu a senha?</h2>
      <p>Não se preocupe, clique no link abaixo para recuprar sua senha</p>
      <p>
        <a href="http://localhost:3000/users/password-reset?token=${token}" target='_blank'>RECUPERAR SENHA</a>
      </p>
      `
      })
      //avisar o usuario que enviamos o email

      return res.render("session/forgot-password", {
        sucess: "Verifique seu email para resetar sua senha!"
      })
    } catch (err) {
      console.error(err)
      return res.render("session/forgot-password",{
        error:"Erro inesperado"
      })
    }

  },
  resetForm(req,res){
    return res.render("session/password-reset",{token:req.query.token})
  },
  async reset(req,res){
    const user = req.user
    const {password,token} = req.body
    try{

      //Cria um novo hash de senha
      const newPassword = await hash(password,8)

      //Atualiza o usuário
      await User.update(user.id, {
        password: newPassword,
        reset_token_expires:"",
        reset_token:"",
      })
      //Avisa o usuário que ele tem uma nova senha
      return res.render("session/login",{
        user:req.body,
        sucess:"Senha atualizada com sucesso."
      })

    }catch(err){
      console.error(err)
      return res.render("session/password-reset",{
        error:"Erro inesperado",
        token,
        user:req.body,
      })
    }
  }
}