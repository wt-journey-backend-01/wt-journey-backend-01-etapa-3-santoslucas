const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && date <= new Date();
};

async function updateAgenteCompleto(req, res) { // PUT
    try {
        const { id } = req.params;
        const { nome, dataDeIncorporacao, cargo } = req.body;

        if (req.body.id) {
            return res.status(400).json({ message: "The 'id' field cannot be changed." });
        }
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        if (!nome || !dataDeIncorporacao || !cargo) {
            return res.status(400).json({ message: 'For a full update (PUT), all fields are required: nome, dataDeIncorporacao, cargo.' });
        }
        if (!isValidDate(dataDeIncorporacao)) {
            return res.status(400).json({ message: 'The "dataDeIncorporacao" field must be a valid date and cannot be in the future.' });
        }

        const updatedAgente = await agentesRepository.update(id, { nome, dataDeIncorporacao, cargo });
        if (!updatedAgente) {
            return res.status(404).json({ message: 'Agent not found.' });
        }
        res.status(200).json(updatedAgente);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while updating agent." });
    }
}

async function updateAgenteParcial(req, res) { // PATCH
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.id) {
            return res.status(400).json({ message: "The 'id' field cannot be changed." });
        }
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        if (data.dataDeIncorporacao && !isValidDate(data.dataDeIncorporacao)) {
            return res.status(400).json({ message: 'The "dataDeIncorporacao" field must be a valid date and cannot be in the future.' });
        }
        
        const updatedAgente = await agentesRepository.update(id, data);
        if (!updatedAgente) {
            return res.status(404).json({ message: 'Agent not found.' });
        }
        res.status(200).json(updatedAgente);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while updating agent." });
    }
}

async function getAllAgentes(req, res) {
    try {
        const agentes = await agentesRepository.findAll(req.query);
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAgenteById(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        const agente = await agentesRepository.findById(id);
        if (!agente) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function createAgente(req, res) {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body;
        if (!nome || typeof nome !== 'string' || nome.trim() === '') {
            return res.status(400).json({ message: 'The "nome" field is required.' });
        }
        if (!cargo || typeof cargo !== 'string' || cargo.trim() === '') {
            return res.status(400).json({ message: 'The "cargo" field is required.' });
        }
        if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
            return res.status(400).json({ message: 'The "dataDeIncorporacao" field is required, must be a valid date, and cannot be in the future.' });
        }
        const newAgente = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });
        res.status(201).json(newAgente);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while creating agent." });
    }
}

async function deleteAgente(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        const success = await agentesRepository.remove(id);
        if (!success) {
            return res.status(404).json({ message: 'Agent not found.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error while deleting agent." });
    }
}

async function findCasosByAgente(req, res) {
  try {
    const { id } = req.params;
    if (!UUID_REGEX.test(id)) {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const agente = await agentesRepository.findById(id);
    if (!agente) {
        return res.status(404).json({ message: "Agent not found." });
    }
    const casos = await casosRepository.findByAgenteId(id);
    res.status(200).json(casos);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
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