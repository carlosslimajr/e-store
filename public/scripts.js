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
  apply(input,func){
    setTimeout(() => {
      input.value = Mask[func](input.value)   //Mask.formatBRL
    }, 1);
  },
  formatBRL(value){
    value = value.replace(/\D/g , "") // removendo todos os digitos!
  
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',  //Convertendo para moedas
      currency: 'BRL'    
    }).format(value/100)

  }
}
//Adiciono o mask direto no html
