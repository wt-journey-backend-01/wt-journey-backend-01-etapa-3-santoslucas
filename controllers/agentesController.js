const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');

const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && date <= new Date();
};

async function getAllAgentes(req, res) {
    try {
        const agentes = await agentesRepository.findAll(req.query);
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor" });
    }
}

async function getAgenteById(req, res) {
    try {
        const { id } = req.params;
        const agente = await agentesRepository.findById(id);

        if (!agente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor" });
    }
}

async function createAgente(req, res) {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body;

        if (!nome || typeof nome !== 'string' || nome.trim() === '') {
            return res.status(400).json({ message: 'O campo "nome" é obrigatório e deve ser uma string.' });
        }
        if (!cargo || typeof cargo !== 'string' || cargo.trim() === '') {
            return res.status(400).json({ message: 'O campo "cargo" é obrigatório e deve ser uma string.' });
        }
        if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
            return res.status(400).json({ message: 'O campo "dataDeIncorporacao" é obrigatório, deve ser uma data válida e não pode ser uma data futura.' });
        }

        const newAgente = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });
        res.status(201).json(newAgente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao criar agente." });
    }
}

async function updateAgente(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.id) {
            return res.status(400).json({ message: "Não é permitido alterar o campo 'id'." });
        }
        
        const updatedAgente = await agentesRepository.update(id, data);
        if (!updatedAgente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        }
        res.status(200).json(updatedAgente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao atualizar agente." });
    }
}

async function deleteAgente(req, res) {
    try {
        const { id } = req.params;
        const success = await agentesRepository.remove(id);
        if (!success) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao deletar agente." });
    }
}

async function findCasosByAgente(req, res) {
  try {
    const { id } = req.params;
    const agente = await agentesRepository.findById(id);
    if (!agente) {
        return res.status(404).json({ message: "Agente não encontrado." });
    }

    const casos = await casosRepository.findByAgenteId(id);
    res.status(200).json(casos);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    deleteAgente,
    findCasosByAgente,
};