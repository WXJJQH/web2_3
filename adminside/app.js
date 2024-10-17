const express = require('express')

const app = express()

app.use(express.static('pages'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/search.html')
})

// app.get('/search_page', (req, res) => {
//   res.sendFile(__dirname + '/pages/search.html')
// })

app.get('/details', (req, res) => {
  res.sendFile(__dirname + '/pages/details.html')
})

app.listen(5002, () => {
  console.log('The server is http://127.0.0.1:5002/ Start up')
})
