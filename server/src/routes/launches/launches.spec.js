const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
  test('It should response with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('Test Post /launches', () => {
  const completeLaunchData = {
    mission: 'USC',
    rocket: 'NCC 1701-D',
    target: 'Kepler-186 f',
    launchDate: 'January 4, 2028',
  }

  const { launchDate, ...launchDataWithoutDate } = completeLaunchData
  const launchDataWithInvalidDate = {
      ...completeLaunchData,
      launchDate: 'zoot'
  }
  test('It should response with 201 success', async () => {
    const response = await request(app)
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201)

    const requestDate = new Date(launchDate).valueOf()
    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(requestDate).toBe(responseDate)
    expect(response.body).toMatchObject(launchDataWithoutDate)
  })

  test('It should catch missing required properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400)
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
    })
  })
    
  test('It should catch for invalid launch date', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error:'Invalid launch date'
        })
  })
})
