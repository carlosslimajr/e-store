const db = require('../../config/db') //pegando bd
const fs = require('fs') //filesystem do node

module.exports = {
  create({filename,path,product_id}) {
    //fazendo a primeira query sql !
    const query = `INSERT INTO files (
      name,
      path,
      product_id
    ) VALUES ($1,$2,$3)
    RETURNING id`
    const values = [
      filename,
      path, 
      product_id
    ]
    //inserindo a query !
    return db.query(query, values) // retornando uma promise
  },
  async delete(id){
    //pegando erros com try catch
    try {
    //Deletando do proprio pc
    //pegando path
    console.log('chegou aqui')
    const result = await db.query(`SELECT * FROM files WHERE id = $1`,[id])
   
    const file = result.rows[0] //o path ta aqui
   
    fs.unlinkSync(file.path) 

    return db.query(`DELETE FROM files WHERE id = $1`, [id]) //deletando do banco

    } catch(err){
      console.error(err)
    }

  }
}