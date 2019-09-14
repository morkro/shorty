export default {
  method: 'GET',
  path: '/',
  handler: (_, reply) => reply.file('index.html')
}