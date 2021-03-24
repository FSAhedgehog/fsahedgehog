/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const HedgeFund = db.model('hedgeFund')
const ThirteenF = db.model('thirteenF')

describe('HedgeFund routes', () => {
  const hedgeFundNames = [
    'BILL & MELINDA GATES',
    'MARTHA STEWART ENTERPRISES',
    'ORAH WINFREY FOUNDATION',
  ]

  const thirteenFDates = [
    '2017-02-14 16:01:28-05',
    '2016-05-16 07:30:14-04',
    '2018-11-14 16:46:29-05',
  ]

  beforeEach(async () => {
    await db.sync({force: true})
  })

  describe('/api/hedgefunds/', () => {
    beforeEach(() => {
      hedgeFundNames.forEach(async (hedgeFund) => {
        await HedgeFund.create({
          name: hedgeFund,
        })
      })
    })

    it('returns all hedgefunds', async () => {
      const res = await request(app).get('/api/hedgefunds').expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body).to.have.lengthOf(3)
      expect(res.body[0]).to.have.property('name')
    })
  }) // end describe('/api/hedgefunds')

  describe('/api/hedgefunds/:id', () => {
    beforeEach(async () => {
      const returnedThirteenFs = await Promise.all(
        thirteenFDates.map((date) => {
          return ThirteenF.create({
            dateOfFiling: date,
          })
        })
      )

      const returnedFunds = await Promise.all(
        hedgeFundNames.map((hedgeFund) => {
          return HedgeFund.create({
            name: hedgeFund,
          })
        })
      )

      for (let i = 0; i < returnedFunds.length; i++) {
        await returnedFunds[i].addThirteenF(returnedThirteenFs[i])
      }
    })

    it('returns single hedgefund', async () => {
      const res = await request(app).get('/api/hedgefunds/2').expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.id).to.equal(2)
      expect(res.body).to.have.property('thirteenFs')
    })
  }) // end describe('/api/hedgefunds/:id)
}) // end describe('Hedgefund routes')
