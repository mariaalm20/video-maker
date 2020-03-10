const readLine = require('readline-sync')
const robots = {
  text: require('./robots/text.js')
}

async function start () {
    const content = {}
    content.searchTerm = askAndReturnSearchTerm() //searchTerm rece askANdReturnSearchTerm
    content.prefix = askAndReturnPrefix()
    await robots.text(content)

    function askAndReturnSearchTerm() {
        return readLine.question('Type a Wikipedia search term:')
      } //quando executar  askAndReturnSearchTerm roda o metodo question da biblioteca readLine e retorna o resultado que o usuario digitar e injeta na propriedade searchTerm
    

    function askAndReturnPrefix(){
      const prefixes = ['Who is', 'What is', 'The history of'] 
      const selectedPrefixIndex = readLine.keyInSelect(prefixes, 'Chose one option:')
      const selectedPrefixText = prefixes[selectedPrefixIndex]
      
      return selectedPrefixText
    }

    console.log(content)
}


start()