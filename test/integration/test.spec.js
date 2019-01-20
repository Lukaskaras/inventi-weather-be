const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const { expect } = require('chai')
const axios = require('axios')

describe('test routes', async () => {
  describe('/location/search', async () => {
    it('should return correct result', async () => {
      const axiosSearchStub = sinon.stub(axios, 'get')
      axiosSearchStub.resolves({
        status: 200,
        data: require('../fixtures/searchApiResponse.json')
      })
      const query = 'dub'
      const response = await request(app)
        .get(`/location/search?query=${query}`)
        .expect(200)
      expect(response.body).to.deep.equal(require('../fixtures/searchExpected.json'))
      axiosSearchStub.restore()
    })
    it('should return 404', async () => {
      const axiosSearchStub = sinon.stub(axios, 'get')
      axiosSearchStub.rejects({
        response: { status: 404 },
        message: 'Not Found'
      })
      const query = 'dub'
      await request(app)
        .get(`/location/search?query=${query}`)
        .expect(404)
      axiosSearchStub.restore()
    })
  })
  describe('/location/:woeid', async () => {
    it('should return correct weather data', async () => {
      const axiosSearchStub = sinon.stub(axios, 'get')
      axiosSearchStub.resolves({
        status: 200,
        data: require('../fixtures/locationApiResponse.json')
      })
      const woeid = 2450022
      const response = await request(app)
        .get(`/location/${woeid}`)
        .expect(200)
      expect(response.body).to.deep.equal(require('../fixtures/locationExpected.json'))
      axiosSearchStub.restore()
    })
    it('should return 404', async () => {
      const axiosSearchStub = sinon.stub(axios, 'get')
      axiosSearchStub.rejects({
        response: { status: 404 },
        message: 'Not Found'
      })
      const woeid = 2450022
      await request(app)
        .get(`/location/${woeid}`)
        .expect(404)
      axiosSearchStub.restore()
    })
  })
})
