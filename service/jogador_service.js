// Regras de negócio e validações separadas do controller.
export function validarJogador(dados) {
  if (!dados || typeof dados.nome_jogador !== 'string' || !dados.nome_jogador.trim() ||
      typeof dados.habilidade_principal !== 'string' || !dados.habilidade_principal.trim()) {
    const erro = new Error('nome_jogador e habilidade_principal são obrigatórios e devem ser textos não vazios')
    erro.status = 400
    throw erro
  }
  return {
    nome_jogador: dados.nome_jogador.trim(),
    habilidade_principal: dados.habilidade_principal.trim()
  }
}

export function validarCodigo(valor) {
  const codigo = Number(valor)
  if (!Number.isSafeInteger(codigo) || codigo <= 0) {
    const erro = new Error('codigo_jogador deve ser um inteiro positivo')
    erro.status = 400
    throw erro
  }
  return codigo
}

export function validarTipoExclusao(tipo = 'logica') {
  if (tipo !== 'logica' && tipo !== 'definitiva') {
    const erro = new Error('Use tipo=logica ou tipo=definitiva')
    erro.status = 400
    throw erro
  }
  return tipo
}

export function responderErro(res, erro) {
  const status = erro.status || 500
  if (status === 500) console.error('Erro interno:', erro)
  res.status(status).json({ status, error: status === 500 ? 'Erro interno do servidor' : erro.message })
}
