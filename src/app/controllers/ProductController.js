const Category = require('../models/Category')
const Product = require('../models/Product')

const {formatPrice} = require('../../lib/utils')

module.exports = {
  create(req, res) {
    //Pegando as categorias
    //Usando promises !
    //as promises estão indo dentro do results !
   
    Category.all().then(function (results) {
       //Puxando todas as categorias de dentro do banco de dados
      const categories = results.rows
      return res.render("products/create.njk", {categories})
    }).catch(function (err) {
      throw new Error(err) //Fazendo tratamento de erros com o catch!
    })

  },
  async post(req, res) {
    const keys = Object.keys(req.body)//Pesquisar o que estou fazendo aqui !
    for (key of keys) {
      //Verificando se algo no objeto esta vazio!
      if (req.body[key] == "") {
        return res.send("Please, fill all fields !")
      }
    }

    //Estou esperando a promise!
    let results = await Product.create(req.body) // só vai seguir dps que retornar aqui
    const productID = results.rows[0].id // peguei o produto retornado

    return res.redirect(`products/${productId}`, {productID}) // aqui só estou enviando um id
    //Salvando as categorias
  },
  async edit(req,res){
    let results = await Product.find(req.params.id) //proucurando id dentro do banco de dados
    const product = results.rows[0] //pegando objeto e todas as informações! !
    if(!product) return res.send("Product not found!")

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)
    
    results = await Category.all() //Puxando todas as categorias para a edição
    const categories = results.rows // colocando todas em um objeto

    return res.render("products/edit.njk", {product,categories}) // aqui só estou enviando um id
    //Salvando as categorias
  }
}