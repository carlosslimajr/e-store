/*
const input = document.querySelector('input[name="price"]')
input.addEventListener("keydown", function(e){

  setTimeout(() => {
    let {value} = e.target //Extraindo o value do botão apertado !
    //Replace /\D/g -> seleciona tudo que não é digito de uma maneira global !
    //Replace /\d/g -> seleciona tudo que não é caracter de uma maneira global !
    value = value.replace(/\D/g , "") // removendo todos os digitos!
  
    value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',  //Convertendo para moedas
      currency: 'BRL'    
    }).format(value/100)

    e.target.value = value //estou pegando o valor dentro da pagina e substitundo pelo meu sem o digito!
  }, 1); //apagando o caracter na mesma hora q digita!
})
maneira basica de formatar  */


//Criando um objeto para tornar dinâmica a função formatBRL
const Mask = {
  apply(input, func) {
    setTimeout(() => {
      input.value = Mask[func](input.value)   //Mask.formatBRL
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, "") // removendo todos os digitos!

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',  //Convertendo para moedas
      currency: 'BRL'
    }).format(value / 100)

  },
  cpfCnpj(value) {
    value = value.replace(/\D/g, "")
    //checking if is cpf or cnpj
    if (value.length > 14) {
      value = value.slice(0, -1)
    }
    if (value.length > 11) {
      //cnpj
      value = value.replace(/(\d{2})(\d)/, "$1.$2") //separando em 2 digitos e colocando ponto

      value = value.replace(/(\d{3})(\d)/, "$1.$2") //separando em 3 digitos e colocando ponto

      value = value.replace(/(\d{3})(\d)/, "$1/$2") //separando agora em 3 digitos e colocando barra

      value = value.replace(/(\d{4})(\d)/, "$1-$2") //separando em 4 digitios e colocando traço
    } else {
      //cpff 078.531.785-65
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1-$2")
    }
    return value
  },
  cep(value) {
    value = value.replace(/\D/g, "")
    if (value.length > 8) {
      value = value.slice(0, -1)
    }
    value = value.replace(/(\d{5})(\d)/, "$1-$2")
    return value
  }
}

//SESSÃO FOTOS !!!

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [], //vai segurar os files !

  handleFileInput(event) { //Logica de inserção das fotos

    const { files: fileList } = event.target // pegando do input
    PhotosUpload.input = event.target //Colocando no input para usar mais tarde
    if (PhotosUpload.hasLimit(event)) return //checando o maximo imposto

    //transformando em array pois ele é somente uma lista com array.from
    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file) //inserindo o arquivo dentro do array

      const reader = new FileReader() // Leitor de arquivos js em BLOB

      reader.onload = () => {  //Quando ficar pronto fazer isso
        const image = new Image() //criando imagem no javascript
        image.src = String(reader.result) //reader result ta o link da imagem

        const div = PhotosUpload.getContainer(image) //Pegando a imagem e colocando dentro de uma div

        PhotosUpload.preview.appendChild(div) //colocando essa div como filho !
      }

      reader.readAsDataURL(file) // Ele vai ler aqui e rodar o ''onload''
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) { //Logica de maximo de fotos
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      //Colocando regra para colocar o maximo de fotos!
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }
    const photosDiv = []
    preview.childNodes.forEach(item => { //Preview é o container todo, child node cada foto !!
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item)
      }
    })
    const totalPhotos = fileList.length + photosDiv.length //total de fotos
    if (totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos')
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() { //função para pegar todos os arquivos
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() // ?
    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    console.log(dataTransfer)
    return dataTransfer.files
  },
  getContainer(image) { //Função para colocar no container !
    const div = document.createElement('div') //criando uma div !
    div.classList.add('photo') //adicionado classe na div
    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image) //colocando imagem dentro da div
    div.appendChild(PhotosUpload.getRemoveButton()) //Adicionando o botão remover
    return div
  },
  getRemoveButton(image) {
    const button = document.createElement('i')

    button.classList.add('material-icons')
    button.innerHTML = 'close'

    return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode //pegando o parente a cima dele ! <div class="photo"
    const photosArray = Array.from(PhotosUpload.preview.children) //Pegando o array das fotos e convertendo !
    const index = photosArray.indexOf(photoDiv)


    PhotosUpload.files.splice(index, 1) //Quebrando o index e removendo 1
    PhotosUpload.input.files = PhotosUpload.getAllFiles() //atualizando e removendo !

    photoDiv.remove() //Ok aqui complicou ,buguei tudo ! REVISASR
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode //tirando do front-end
    if (photoDiv.id) { //certificando se tem id
      const removedFiles = document.querySelector('input[name="removed_files"')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},` //concatenando os ids se deletar mais de um
      }

    }


    photoDiv.remove()
  }
}

//GALERIA DE FOTOS

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight >img'), //pegando highlight
  previews: document.querySelectorAll('.gallery-preview img'), //pegando toda a lista das imagens
  setImage(e) {
    const { target } = e

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))//removendo active de todos
    target.classList.add('active')

    ImageGallery.highlight.src = target.src //trocando highlight
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErros(input) //limpando
    results = Validate[func](input.value)
    input.value = results.value

    if(results.error){
      Validate.displayError(input,results.error)
    }
  },
  displayError(input,error){
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus()
  },
  clearErros(input){
    const errorDiv = input.parentNode.querySelector(".error")
    if(errorDiv){
      errorDiv.remove()
    }
  },
  isEmail(value){
    let error = null

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    if(!value.match(mailFormat)){
      error = "Email inválido"
    }
    //^ serve para dizer como ele tem q começar
    return {
      error,
      value
    }
  },
  isCpfCnpj(value){
    let error = null

    const cleanValues = value.replace(/\D/g,"")
    if(cleanValues.length > 11 && cleanValues.length !==14){
      error ="CNPJ incorreto" //Verificando o tamanho do cnpj
    }else if(cleanValues.length<12 && cleanValues.length !==11){
      error ="CPF incorreto"
    }
    return{
      error,
      value
    }
  },
  isCep(value){
    let error = null

    const cleanValues = value.replace(/\D/g,"") 

    if(cleanValues.length !==8){
      error ="CEP incorreto"
    }

    return{
      error,
      value
    }
  }
}
