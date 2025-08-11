const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && date <= new Date();
};

async function getAllAgentes(req, res) {
    try {
        const { cargo, dataDeIncorporacaoInicio, dataDeIncorporacaoFim, sort } = req.query;

        if (dataDeIncorporacaoInicio && !DATE_REGEX.test(dataDeIncorporacaoInicio)) {
            return res.status(400).json({ message: 'Formato inválido para dataDeIncorporacaoInicio. Use YYYY-MM-DD.' });
        }
        if (dataDeIncorporacaoFim && !DATE_REGEX.test(dataDeIncorporacaoFim)) {
            return res.status(400).json({ message: 'Formato inválido para dataDeIncorporacaoFim. Use YYYY-MM-DD.' });
        }

        const filters = { cargo, dataDeIncorporacaoInicio, dataDeIncorporacaoFim, sort };

        const agentes = await agentesRepository.findAll(filters);
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

async function getAgenteById(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const agente = await agentesRepository.findById(id);
        if (!agente) {
            return res.status(404).json({ message: 'Agente não encontrado.' });
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

async function createAgente(req, res) {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body;
        if (!nome || typeof nome !== 'string' || nome.trim() === '') {
            return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
        }
        if (!cargo || typeof cargo !== 'string' || cargo.trim() === '') {
            return res.status(400).json({ message: 'O campo "cargo" é obrigatório.' });
        }
        if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
            return res.status(400).json({ message: 'O campo "dataDeIncorporacao" é obrigatório, deve ser uma data válida e não pode ser no futuro.' });
        }
        const newAgente = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });
        res.status(201).json(newAgente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao criar agente." });
    }
}

async function updateAgenteCompleto(req, res) {
    try {
        const { id } = req.params;
        const { nome, dataDeIncorporacao, cargo } = req.body;
        if (req.body.id) {
            return res.status(400).json({ message: "O campo 'id' não pode ser alterado." });
        }
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        if (nome === undefined || dataDeIncorporacao === undefined || cargo === undefined) {
            return res.status(400).json({ message: 'Para uma atualização completa (PUT), todos os campos são obrigatórios: nome, dataDeIncorporacao, cargo.' });
        }
        if (!isValidDate(dataDeIncorporacao)) {
            return res.status(400).json({ message: 'O campo "dataDeIncorporacao" deve ser uma data válida e não pode ser no futuro.' });
        }
        const updatedAgente = await agentesRepository.update(id, { nome, dataDeIncorporacao, cargo });
        if (!updatedAgente) {
            return res.status(404).json({ message: 'Agente não encontrado.' });
        }
        res.status(200).json(updatedAgente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao atualizar agente." });
    }
}

async function updateAgenteParcial(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.id) {
            return res.status(400).json({ message: "O campo 'id' não pode ser alterado." });
        }
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        if (data.dataDeIncorporacao && !isValidDate(data.dataDeIncorporacao)) {
            return res.status(400).json({ message: 'O campo "dataDeIncorporacao" deve ser uma data válida e não pode ser no futuro.' });
        }
        const updatedAgente = await agentesRepository.update(id, data);
        if (!updatedAgente) {
            return res.status(404).json({ message: 'Agente não encontrado.' });
        }
        res.status(200).json(updatedAgente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao atualizar agente." });
    }
}

async function deleteAgente(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const success = await agentesRepository.remove(id);
        if (!success) {
            return res.status(404).json({ message: 'Agente não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao deletar agente." });
    }
}

async function findCasosByAgente(req, res) {
  try {
    const { id } = req.params;
    if (!UUID_REGEX.test(id)) {
        return res.status(400).json({ message: 'Formato de ID inválido.' });
    }
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
    updateAgenteCompleto,
    updateAgenteParcial,
    deleteAgente,
    findCasosByAgente,
};