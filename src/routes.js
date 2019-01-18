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

router.get('/location/:woeid', async (req, res) => {
  const { woeid } = req.params
  const response = await axios({
    method: 'get',
    url: `${config.weatherApi.url}/f${woeid}`
  })

  if (response.status !== 200) {
    res.status(response.status).send()
    return
  }

  const { data } = response
  const consolidatedWeather = data.consolidated_weather
  const formatted = consolidatedWeather.map((day) => {
    return {
      weatherState: day.weather_state_name,
      date: day.applicable_date,
      minTemp: Math.round(day.min_temp),
      maxTemp: Math.round(day.max_temp)
    }
  })
  res.status(200).send(formatted)
})

module.exports = router