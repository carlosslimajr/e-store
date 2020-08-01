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
  }
}