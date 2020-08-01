const {formatPrice,date} = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')


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
    const keys = Object.keys(req.body)
    for (key of keys) {
      //Verificando se algo no objeto esta vazio!
      if (req.body[key] == "") {
        return res.send("Please, fill all fields !")
      }
    }

    if(req.files.lenght == 0){
      return res.send("Please, send at least one image") //checando se tem imagem
    }

    //Estou esperando a promise!
    let results = await Product.create(req.body) // só vai seguir dps que retornar aqui
    const productId = results.rows[0].id // peguei o produto retornado

    const filesPromise = req.files.map(file =>File.create({...file,product_id: productId})) //promises de foreach
    await Promise.all(filesPromise) //esperando construção do arquivo me perdi aqui

    return res.redirect(`products/${productId}/edit`) // aqui só estou enviando um id
    //Salvando as categorias
  },
  async show(req,res){

    let results = await Product.find(req.params.id) //indo buscar produto
    const product = results.rows[0] //pegando os produtos
    if(!product) return res.send ("Product Not Found!")
    
    const {day,hour,minutes,month} = date(product.updated_at) //pegando todos os timestamps

    product.published = {
      day: `${day}/${month}`,
      hour: `${hour}h${minutes}`
    }
    product.oldprice = formatPrice(product.old_price)
    product.price = formatPrice(product.price)
    
    //PEGANDO AS IMAGENS
    results = await Product.files(product.id)
    const files = results.rows.map(file=> ({
      ...file, //espalhando o arquivo aqui
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`//to removendo public pra corrigir
    }))


    return res.render("products/show",{product,files})
  },
  async edit(req,res){
    let results = await Product.find(req.params.id) //proucurando id dentro do banco de dados
    const product = results.rows[0] //pegando objeto e todas as informações! !
    if(!product) return res.send("Product not found!")

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)
    //->GET CATEGORIES
    results = await Category.all() //Puxando todas as categorias para a edição
    const categories = results.rows // colocando todas em um objeto

    //->GET IMAGES
    results = await Product.files(product.id) //peguei todas as imagens aqui
    let files = results.rows //pq é um ou mais !
    files = files.map(file=> ({
      ...file, //espalhando o arquivo aqui
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`//to removendo public pra corrigir
    })) //corrigindo o endereço do banco de dados, colocando o caminho inteiro->localhost...

    return res.render("products/edit.njk", {product,categories,files}) // aqui só estou enviando um id
    //Salvando as categorias
  },
  async put (req,res){
    const keys = Object.keys(req.body)//Pesquisar o que estou fazendo aqui !
    for (key of keys) {
      //Verificando se algo no objeto esta vazio!
      if (req.body[key] == "" && key !="removed_files") {
        return res.send("Please, fill all fields !")
      }
    }
    //INSERINDO ARQUIVOS NA ATUALIZAÇÃO
    if(req.files.length != 0){ //verificando se tem arquivos
      const newFilesPromise = req.files.map(file=>File.create({...file,product_id: req.body.id}))
      await Promise.all(newFilesPromise)
    }

    //removendo imagens do bd
    if(req.body.removed_files){
      const removedFiles = req.body.removed_files.split(",") //criando um novo array todos separados por virgula pq la no front-end separamos os ids por virgula!
      
      const lastIndex = removedFiles.length -1 //ultima posição vai ta vazia e vou remover !
      removedFiles.splice(lastIndex,1) //[1,2,3]
      //Criando array de promises !
      const removedFilesPromise = removedFiles.map(id=>File.delete(id))
      await Promise.all(removedFilesPromise)
    }

    req.body.price = req.body.price.replace(/\D/g, "") // limpando o body price

    if(req.body.old_price != req.body.price){
      const oldProduct = await Product.find(req.body.id) // proucurando no banco de dados o antigo

      req.body.old_price = oldProduct.rows[0].price
    }
    await Product.update(req.body)

    return res.redirect(`/products/${req.body.id}`)
  },
  async delete(req,res){
    await Product.delete(req.body.id)

    return res.redirect('products/create')
  }
}