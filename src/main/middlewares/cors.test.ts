import app from '@/main/config/app'
import request from 'supertest'

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    app.get('/test_cors', (request, response) => {
      response.send()
    })

    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
