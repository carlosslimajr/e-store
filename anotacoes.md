sessão 4 -js avançado ->{

18->(
alteração na tabela usuarios do banco de dados !

    ALTER TABLE "users" ADD COLUMN reset_token text;
    ALTER TABLE "users" ADD COLUMN reset_token_expires text;

    criando uma const crypt = require('crypto') -> do proprio node
    serve para criar uma token !
    dps chamar !
    const token = crypto.randomBytes(20).toString("hex") ->hexadecimal

    criando um tempo maximo ! ->(
       let now = new Date()
    now = now.setHours(now.getHours()+ 1) //Somente uma hora
    )
    Instalando npm install nodemailer (enviar emails obviamente)
    mailer.js na config
    entrei no site https://mailtrap.io/ conta-> integrations->nodemailer!
    pegar config que o site libera e copiar

)

}
