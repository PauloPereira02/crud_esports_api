import express from 'express'
import { router } from './routes/jogador_rota.js'

let server = express()
server.use(express.json())
server.use('/', router)
server.listen(3000, function () {
  console.log('API de eSports rodando na porta 3000')
})
