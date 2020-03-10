const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
  await fetchContentFromWikipedia(content) //baixar conteudo
  sanitizeContent(content) //limpar
  breakContentIntoSentences(content) //quebrar em sentenças
 
  async function fetchContentFromWikipedia(content){
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) //instancia autenticada do algorithmia
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2') //url do metodo algo
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm) //pipe aceita por parametro um conteudo q queremos buscar no wikipedia
    const wikipediaContent = wikipediaResponse.get()

    content.sourceContentOriginal = wikipediaContent.content
  }

  function sanitizeContent(content) {
    const withoutBlankLineAndMarkdown = removeBlankLinesandMarkDown(content.sourceContentOriginal)
    const withoutDates = removeDates(withoutBlankLineAndMarkdown)
    
    content.sourceContentSanitized = withoutDates
    
    function removeBlankLinesandMarkDown(text) {
      const allLines = text.split('\n')
      const withoutBlankLineAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false
        }
        return true
      })
      return withoutBlankLineAndMarkdown.join('')
    }
  }

  function removeDates(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
  }

  function breakContentIntoSentences(content) {
    content.sentences = []

    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

}

module.exports = robot