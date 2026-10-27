import express from 'express'
import jogador from '../controller/jogador_controller.js'

let router = express.Router()
router.post('/jogador', jogador.create)
router.get('/jogador', jogador.all)
router.get('/jogador/buscar', jogador.buscar)
router.get('/jogador/:codigo_jogador', jogador.byId)
router.put('/jogador/:codigo_jogador', jogador.update)
router.delete('/jogador/:codigo_jogador', jogador.delete)

export { router }
