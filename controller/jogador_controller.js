import connect from '../config/connection.js'
import { validarJogador, validarCodigo, validarTipoExclusao, responderErro } from '../service/jogador_service.js'

let jogador = {}
// Pool reutilizado em todas as operações; cada consulta é assíncrona.
let con = await connect()

jogador.create = async function (req, res) {
  try {
    const dados = validarJogador(req.body)
    const sql = 'INSERT INTO jogador (nome_jogador, habilidade_principal) VALUES (?, ?);'
    const [result] = await con.query(sql, [dados.nome_jogador, dados.habilidade_principal])
    res.status(201).json({ status: 'Inserção efetuada com sucesso', codigo_jogador: result.insertId })
  } catch (e) {
    responderErro(res, e)
  }
}

jogador.all = async function (req, res) {
  try {
    const incluirExcluidos = req.query.incluirExcluidos === 'true'
    const sql = incluirExcluidos ? 'SELECT * FROM jogador ORDER BY codigo_jogador;' :
      'SELECT * FROM jogador WHERE excluido = 0 ORDER BY codigo_jogador;'
    const [jogadores] = await con.query(sql)
    res.json({ status: 200, error: null, response: jogadores })
  } catch (e) {
    responderErro(res, e)
  }
}

jogador.byId = async function (req, res) {
  try {
    const codigo = validarCodigo(req.params.codigo_jogador)
    const [dados] = await con.query('SELECT * FROM jogador WHERE codigo_jogador = ? AND excluido = 0;', [codigo])
    if (dados.length === 0) return res.status(404).json({ status: 404, error: 'Jogador não encontrado' })
    res.json({ status: 200, error: null, response: dados[0] })
  } catch (e) {
    responderErro(res, e)
  }
}

jogador.buscar = async function (req, res) {
  try {
    const nome = req.query.nome
    if (typeof nome !== 'string' || !nome.trim()) return res.status(400).json({ status: 400, error: 'Informe ?nome= para pesquisar' })
    // Escapa curingas para buscar os caracteres % e _ literalmente.
    const termo = nome.trim().replace(/[!%_]/g, (char) => '!' + char)
    const sql = "SELECT * FROM jogador WHERE excluido = 0 AND nome_jogador LIKE ? ESCAPE '!' ORDER BY nome_jogador;"
    const [dados] = await con.query(sql, [`%${termo}%`])
    res.json({ status: 200, error: null, response: dados })
  } catch (e) {
    responderErro(res, e)
  }
}

jogador.update = async function (req, res) {
  try {
    const codigo = validarCodigo(req.params.codigo_jogador)
    const dados = validarJogador(req.body)
    const sql = 'UPDATE jogador SET nome_jogador = ?, habilidade_principal = ? WHERE codigo_jogador = ? AND excluido = 0;'
    const [result] = await con.query(sql, [dados.nome_jogador, dados.habilidade_principal, codigo])
    if (result.affectedRows === 0) return res.status(404).json({ status: 404, error: 'Jogador não encontrado' })
    res.json({ status: 'Atualização efetuada com sucesso', codigo_jogador: codigo })
  } catch (e) {
    responderErro(res, e)
  }
}

jogador.delete = async function (req, res) {
  try {
    const codigo = validarCodigo(req.params.codigo_jogador)
    const tipo = validarTipoExclusao(req.query.tipo)
    let sql
    if (tipo === 'logica') {
      sql = 'UPDATE jogador SET excluido = 1 WHERE codigo_jogador = ? AND excluido = 0;'
    } else {
      sql = 'DELETE FROM jogador WHERE codigo_jogador = ?;'
    }
    const [result] = await con.query(sql, [codigo])
    if (result.affectedRows === 0) return res.status(404).json({ status: 404, error: 'Jogador não encontrado' })
    res.json({ status: `Exclusão ${tipo} efetuada com sucesso`, codigo_jogador: codigo })
  } catch (e) {
    responderErro(res, e)
  }
}

export default jogador
