const {formatPrice} = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')


module.exports = {

  async index(req,res){
    try{
    let results = await Product.all()
    const products = results.rows //coloco todos os produtos aqui

    if(!products) return res.send("Products not found!")

    async function getImage(productId){ //pegando as imagens e jogando para cada produto !
      let results = await Product.files(productId)
      const files = results.rows.map(file=> `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)//to removendo public pra corrigir
      return files[0]
    }
    const productsPromises = products.map(async product=>{ //pegando todos os produtos!
      product.img = await getImage(product.id)
      product.oldprice = formatPrice(product.old_price)
      product.price = formatPrice(product.price)
      return product
    }).filter((product,index)=>index>6 ? false : true) // depois ver q porra ta rolando aqui

    const lastAdded = await Promise.all(productsPromises)
    //console.log(lastAdded)

    return res.render("home/index", {products: lastAdded})
  } catch(err){
    console.log(err)
  }

}}