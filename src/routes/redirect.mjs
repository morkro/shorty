import { checkEmojiID } from '../utils.mjs'

export default {
  method: 'GET',
  path: '/{id}',
  async handler (request, reply) {
    try {
      const document = await checkEmojiID(request.server.app.db, request.params.id)
      if (!document) {
        return { error: 'Shortened URL not found.' }
      }
      return reply.redirect(document.originalURL.href)
    } catch (error) {
      return { error, message: 'No URL found.' }
    }
  }
}