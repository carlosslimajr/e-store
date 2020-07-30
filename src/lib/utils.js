module.exports = {
  date: function (timestamp) {
    const date = new Date(timestamp)

    //pegando o ano
    const year = date.getUTCFullYear()
    //mes
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    //dia
    const day = `0${date.getUTCDate()}`.slice(-2)

    return {
      day,
       month,
        year,
         iso: `${year}-${month}-${day}`,
         birthday: `${day}-${month}`,
         format: `${day}/${month}/${year}`,//para o db
    }
    // return `${year}-${month}-${day}`

  },
  formatPrice(price){
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',  //Convertendo para moedas
      currency: 'BRL'    
    }).format(price/100)
  }
}