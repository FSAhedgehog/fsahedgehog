/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const HedgeFund = db.model('hedgeFund')

describe('HedgeFund routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/hedgefunds/', () => {
    const hedgeFundNames = [
      'BILL & MELINDA GATES',
      'MARTHA STEWART ENTERPRISES',
      'ORAH WINFREY FOUNDATION',
    ]

    beforeEach(() => {
      hedgeFundNames.forEach(async (hedgeFund) => {
        await HedgeFund.create({
          name: hedgeFund,
        })
      })
    })

    it('GET /api/hedgefunds', async () => {
      const res = await request(app).get('/api/hedgefunds').expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body).to.have.lengthOf(3)
      expect(res.body[0]).to.have.property('name')
    })
  }) // end describe('/api/hedgefunds')
}) // end describe('Hedgefund routes')
