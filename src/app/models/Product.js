const db = require('../../config/db') //pegando bd

module.exports = {
  create(data) {
    //fazendo a primeira query sql !
    const query = `INSERT INTO products (
      category_id,
      user_id,
      name,
      description,
      old_price,
      price,
      quantity,
      status
    )VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id`

    //formatando o price !
    data.price = data.price.replace(/\D/g , "")
    //convertendo pra integer e na puxada de volta converto novamente

    const values = [
      data.category_id,
      data.user_id || 1, //Se não tiver usuario, colocar 1
      data.name,
      data.description,
      data.old_price || data.price, //ná primeira vez vai colocar o data price!
      data.price,
      data.quantity,
      data.status || 1, //Inicialmente como disponível!
    ]
    //inserindo a query !
    return db.query(query, values) // retornando uma promise
  },
  find(id){
    return db.query('Select * FROM products WHERE ID= $1',[id])
  },
  update(data){
    const query = `
      UPDATE products SET
        category_id=($1),
        user_id=($2),
        name=($3),
        description=($4),
        old_price=($5),
        price=($6),
        quantity=($7),
        status=($8)
      WHERE id = $9

    `
    const values = [
      data.category_id,
      data.user_id,
      data.name,
      data.description,
      data.old_price,
      data.price,
      data.quantity,
      data.status,
      data.id
    ]

    return db.query(query,values)
  },
  delete(id){
    return db.query('DELETE FROM products WHERE id =$1', [id])
  }

}