import Joi  from '@hapi/joi'
import { shortenURL } from '../utils.mjs'

const createResponse = data => ({
  originalURL: data.originalURL.href,
  emojiID: data.emojiID
})

export default  {
  method: 'POST',
  path: '/new',
  options: {
    auth: false,
    validate: {
      payload: {
        url: Joi.string().uri()
      }
    }
  },
  async handler (request, reply) {
    let originalURL
    try {
      originalURL = new URL(request.payload.url)
    } catch (error) {
      return { error, message: 'Invalid URL' }
    }
  
    try {
      const response = await shortenURL(request.server.app.db, originalURL)
      return createResponse(response.value)
    } catch (error) {
      return { error, message: 'Unable to shorten URL' }
    }
  }
}