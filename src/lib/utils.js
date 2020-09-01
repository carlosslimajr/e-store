module.exports = {
  date: function (timestamp) {
    const date = new Date(timestamp)

    //pegando o ano
    const year = date.getFullYear()
    //mes
    const month = `0${date.getMonth() + 1}`.slice(-2)
    //dia
    const day = `0${date.getDate()}`.slice(-2)
    //horas
    const hour = date.getHours()
    //minutos
    const minutes = date.getMinutes()

    return {
      day,
      month,
      year,
      hour,
      minutes,
      iso: `${year}-${month}-${day}`,
      birthday: `${day}-${month}`,
      format: `${day}/${month}/${year}`,//para o db
    }
    // return `${year}-${month}-${day}`

  },
  formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',  //Convertendo para moedas
      currency: 'BRL'
    }).format(price / 100)
  },
  formatCpfCnpj(value) {
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
  formatCep(value) {
    value = value.replace(/\D/g, "")
    if (value.length > 8) {
      value = value.slice(0, -1)
    }
    value = value.replace(/(\d{5})(\d)/, "$1-$2")
    return value
  }
}