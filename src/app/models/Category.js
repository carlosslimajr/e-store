const db = require('../../config/db') //pegando bd


module.exports = {
  //isso aqui já é uma promise!
  //Pegando todas as categorias de dentro do banco de dados
  all(){
    return db.query(
      `
      SELECT * FROM categories
      `
    )
  }
}