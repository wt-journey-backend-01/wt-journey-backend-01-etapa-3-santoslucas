const agentesRepository = require('../repositories/agentesRepository');
const { formatError } = require('../utils/errorHandler');

async function getAllAgentes(req, res) {
  try {
    const agentes = await agentesRepository.findAll(req.query);
    res.json(agentes);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function getAgenteById(req, res) {
  try {
    const agente = await agentesRepository.findById(req.params.id);
    if (!agente) {
      return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(agente);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function createAgente(req, res) {
  try {
    const { nome, dataDeIncorporacao, cargo } = req.body;
    
    // As validações que você já tinha podem ser mantidas aqui se preferir.
    // Por simplicidade, vou direto para a criação.
    
    const newAgente = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });
    res.status(201).json(newAgente);
  } catch (error) {
    // Se houver um erro de constraint do banco (ex: campo não pode ser nulo)
    // ele será capturado aqui.
    res.status(500).json({ message: "Erro ao criar agente" });
  }
}

async function updateAgente(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Remove o id do corpo se ele existir para evitar erros
    if (data.id) delete data.id;

    const updatedAgente = await agentesRepository.update(id, data);
    
    if (!updatedAgente) {
      return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(updatedAgente);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar agente" });
  }
}

async function patchAgente(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.id) delete updates.id;

    const updatedAgente = await agentesRepository.update(id, updates);

    if (!updatedAgente) {
      return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(updatedAgente);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar agente" });
  }
}

async function deleteAgente(req, res) {
  try {
    const success = await agentesRepository.remove(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar agente" });
  }
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  patchAgente,
  deleteAgente,
};