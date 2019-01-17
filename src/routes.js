const express = require('express')
const router = express.Router()
const config = require('../config')
const axios = require('axios')

router.get('/location/search', async (req, res) => {
  const { query } = req.query
  const response = await axios({
    method: 'get',
    url: `${config.weatherApi.url}/search?query=${query}`
  })

  if (response.status !== 200) {
    res.status(response.status).send()
    return
  }
  const data = response.data
  const foundLocations = data.map((location) => {
    return {
      title: location.title,
      woeid: location.woeid
    }
  })

  res.status(200).send(foundLocations)
})

module.exports = router