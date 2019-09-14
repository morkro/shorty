import Hapi  from '@hapi/hapi'
import mongodb  from 'mongodb'
import inert from 'inert'
import routes from './routes/index.mjs'

const createServer = () => Hapi.server({
  port: 9000,
  host: 'localhost',
  routes: {
    files: {
      // relativeTo: path.join(__dirname, 'public')
      relativeTo: './public'
    }
  }
})

export default async function server () {
  const { MongoClient } = mongodb
  const server = createServer()

  await server.register(inert)

  try {
    const client = await MongoClient.connect(
      process.env.DATABASE,
      { useNewUrlParser: true }
    )
    server.app.db = client.db('shortener')
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