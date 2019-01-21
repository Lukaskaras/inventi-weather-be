const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }))
app.use(cors())
app.use((req, res, next) => {
  console.log('calling ' + req.method + ' for ' + req.path + ' -> ' + JSON.stringify(req.query) + ' -> ' + JSON.stringify(req.body))
  next()
})

app.use('/', require('./src/routes'))

const port = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

module.exports = app
