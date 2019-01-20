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
  let response
  try {
    response = await axios({
      method: 'get',
      url: `${config.weatherApi.url}/${woeid}`
    })
  } catch (error) {
    res.status(error.response.status).send(error.message)
    return
  }

  const { data } = response
  const consolidatedWeather = data.consolidated_weather
  const formatted = consolidatedWeather.map((day) => {
    return {
      weatherState: correctWeatherState(day),
      date: day.applicable_date,
      minTemp: Math.round(day.min_temp),
      maxTemp: Math.round(day.max_temp)
    }
  })
  res.status(200).send(formatted)
})

const correctWeatherState = (day) => {
  if ((Math.round(day.max_temp)) > 2) {
    return day.weather_state_abbr
  }

  return (['hr', 'lr', 's'].includes(day.weather_state_abbr)) ? 'sn' : day.weather_state_abbr
}

module.exports = router
