import path from 'path'
import Hapi  from '@hapi/hapi'
import mongodb  from 'mongodb'
import inert from 'inert'
import routes from './routes/index.mjs'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

function createServer () {
  return Hapi.server({
    port: process.env.PORT || 9000,
    host: '0.0.0.0',
    routes: {
      files: {
        relativeTo: path.join(__dirname, '..', 'public')
      }
    }
  })
}

export default async function server () {
  const { MongoClient } = mongodb
  const server = createServer()

  await server.register(inert)

  try {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true }
    )
    server.app.db = client.db(process.env.MONGODB_NAME)
  } catch (error) {
    console.error('Failed to connect to the database', error)
    process.exit(1)
  }

  for (const [key, value] of Object.entries(routes)) {
    server.route(value)
  }

  await server.start()
  console.log(`Server running at ${server.info.uri}`)
}