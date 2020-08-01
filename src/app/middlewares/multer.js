//Configurando o multer para transferir arquivos para o db
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req,file,callback)=>{  //Onde vou salvar esse arquivo

    callback(null,'./public/images')  //1 é erro e 2 é destino
  },
  filename: (req,file,callback)=>{  //nome do arquivo que vou ter
    callback(null,`${Date.now().toString()}-${file.originalname}`)  //Setando nome do arquivo -> colocando data e nome, dessa forma ele se torna único, pois com mesmo nome não vai salvar igual !

  }
}) 
const fileFilter = (req,file,callback)=>{ //filtrando
  const isAccepted = ['image/png','image/jpeg','/image/jpg'] //os estilos aceitados
  .find(acceptedFormat => acceptedFormat ==file.mimetype)  //mimetype é config do multer q mostra o tipo
  if(isAccepted){
    return callback(null,true);
  }
  return callback(null,false) //se chegar aqui quer dizer que falhou
}
module.exports = multer({
  //exportando o multer
  storage,   //De que forma vamos trabalhar no storage
  fileFilter,  //colocando filtro para o que vai adicionar
})