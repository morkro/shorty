import dotenv from 'dotenv'
import server from './src/server.mjs'

dotenv.config()

server()

process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})