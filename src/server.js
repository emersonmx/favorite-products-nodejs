import express from 'express'
import helmet from 'helmet'

const host = '127.0.0.1'
const port = 3000

const app = express()

app.use(helmet())
  .use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.listen(port, () => {
  console.log(`Listening on ${host}:${port}`)
})
