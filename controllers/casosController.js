// English comments as requested by the user.
const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

async function getAllCasos(req, res) {
    try {
        const casos = await casosRepository.findAll(req.query);
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

async function getCasoById(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        const caso = await casosRepository.findById(id);
        if (!caso) {
            return res.status(404).json({ message: 'Case not found.' });
        }
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

async function createCaso(req, res) {
    try {
        const { titulo, descricao, status, agente_id } = req.body;
        if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({ message: 'The "titulo" field is required.' });
        }
        if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
            return res.status(400).json({ message: 'The "descricao" field is required.' });
        }
        if (!status || !['aberto', 'solucionado'].includes(status)) {
            return res.status(400).json({ message: 'The "status" field is required and must be either "aberto" or "solucionado".' });
        }
        if (agente_id) {
            if(!UUID_REGEX.test(agente_id)) return res.status(400).json({ message: 'Invalid agente_id format.' });
            const agente = await agentesRepository.findById(agente_id);
            if (!agente) {
                return res.status(404).json({ message: 'Agent with the provided ID was not found.' });
            }
        }
        const novoCaso = await casosRepository.create({ titulo, descricao, status, agente_id });
        res.status(201).json(novoCaso);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while creating case." });
    }
}

async function updateCasoCompleto(req, res) {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, agente_id } = req.body;
        
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        if (!titulo || !descricao || !status) {
             return res.status(400).json({ message: 'For a full update (PUT), all fields are required: titulo, descricao, status.' });
        }
        if (!['aberto', 'solucionado'].includes(status)) {
            return res.status(400).json({ message: 'The "status" field must be either "aberto" or "solucionado".' });
        }
        if (agente_id) {
             if(!UUID_REGEX.test(agente_id)) return res.status(400).json({ message: 'Invalid agente_id format.' });
             const agente = await agentesRepository.findById(agente_id);
             if (!agente) return res.status(404).json({ message: 'Agent with the provided ID was not found.' });
        }
        const casoAtualizado = await casosRepository.update(id, { titulo, descricao, status, agente_id });
        if (!casoAtualizado) {
            return res.status(404).json({ message: 'Case not found.' });
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while updating case." });
    }
}


async function updateCasoParcial(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        if (data.id) {
            return res.status(400).json({ message: "The 'id' field cannot be changed." });
        }
        if (data.status && !['aberto', 'solucionado'].includes(data.status)) {
            return res.status(400).json({ message: 'The "status" field must be either "aberto" or "solucionado".' });
        }
        if (data.agente_id) {
            if(!UUID_REGEX.test(data.agente_id)) return res.status(400).json({ message: 'Invalid agente_id format.' });
            const agente = await agentesRepository.findById(data.agente_id);
            if (!agente) {
                return res.status(404).json({ message: 'Agent with the provided ID was not found.' });
            }
        }
        const casoAtualizado = await casosRepository.update(id, data);
        if (!casoAtualizado) {
            return res.status(404).json({ message: 'Case not found.' });
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while updating case." });
    }
}


async function deleteCaso(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        const success = await casosRepository.remove(id);
        if (!success) {
            return res.status(404).json({ message: 'Case not found.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error while deleting case." });
    }
}

async function getAgenteByCasoId(req, res) {
    try {
        const { caso_id } = req.params;
        if (!UUID_REGEX.test(caso_id)) {
            return res.status(400).json({ message: 'Invalid case ID format.' });
        }
        const caso = await casosRepository.findById(caso_id);
        if (!caso) {
            return res.status(404).json({ message: 'Case not found.' });
        }
        if (!caso.agente_id) {
            return res.status(404).json({ message: 'This case does not have an associated agent.' });
        }
        const agente = await agentesRepository.findById(caso.agente_id);
        if (!agente) {
            return res.status(404).json({ message: 'Agent associated with the case was not found.' });
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCasoCompleto,
    updateCasoParcial,
    deleteCaso,
    getAgenteByCasoId,
};