const db = require('../../config/db') //pegando bd
const { hash } = require('bcryptjs')

module.exports = {
  async findOne(filters) {
    let query = "SELECT * FROM users"
    // console.log(filters)
    Object.keys(filters).map(key => {
      //WHERE | OR | AND
      //Construindo dinamicamente !
      query = `${query}
      ${key}
      `
      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })
    })

    const results = await db.query(query)

    return results.rows[0] // no 0 pq estou proucurando 1 só
  },
  async create(data) {
    try {
      //fazendo a primeira query sql !
      const query = `INSERT INTO users (
      name,
      email,
      password,
      cpf_cnpj,
      cep,
      adress
    )VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id`

      //hash of password -> senha n pode ir aberta !
      //Criptografando senha !
      const passwordHash = await hash(data.password, 8)
      const values = [
        data.name,
        data.email,
        passwordHash,
        data.cpf_cnpj.replace(/\D/g, ""),
        data.cep.replace(/\D/g, ""),
        data.adress,
      ]

      const results = await db.query(query, values)
      return results.rows[0].id

    } catch (error) {
      console.error(error)
    }

  },
  async update(id, fields) {
    let query = "UPDATE users SET"

    Object.keys(fields).map((key, index, array) => {
      //checando se estou no ultimo e não colocar virgula !
      if ((index + 1) < array.length) {
        query = ` ${query}
        ${key} = '${fields[key]}',
        `
      } else {
        //ultima interação é essa! sem virgula
        query = ` ${query}
        ${key} = '${fields[key]}'
        WHERE id = ${id}
        `
      }
    })
    await db.query(query)
    return
  }

}