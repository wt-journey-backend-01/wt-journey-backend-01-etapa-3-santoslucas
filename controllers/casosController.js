const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

async function getAllCasos(req, res) {
    try {
        const casos = await casosRepository.findAll(req.query);
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

async function getCasoById(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const caso = await casosRepository.findById(id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado.' });
        }
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

async function createCaso(req, res) {
    try {
        const { titulo, descricao, status, agente_id } = req.body;

        if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({ message: 'O campo "titulo" é obrigatório.' });
        }
        if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
            return res.status(400).json({ message: 'O campo "descricao" é obrigatório.' });
        }
        if (!status || !['aberto', 'solucionado'].includes(status)) {
            return res.status(400).json({ message: 'O campo "status" é obrigatório e deve ser "aberto" ou "solucionado".' });
        }
        if (agente_id) {
            if(!UUID_REGEX.test(agente_id)) return res.status(400).json({ message: 'Formato de ID de agente inválido.' });
            const agente = await agentesRepository.findById(agente_id);
            if (!agente) {
                return res.status(404).json({ message: 'Agente com o ID fornecido não foi encontrado.' });
            }
        }
        
        const novoCaso = await casosRepository.create({ titulo, descricao, status, agente_id });
        res.status(201).json(novoCaso);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao criar caso." });
    }
}

async function updateCasoCompleto(req, res) {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, agente_id } = req.body;
        
        if (req.body.id) {
            return res.status(400).json({ message: "O campo 'id' não pode ser alterado." });
        }
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        if (!titulo || !descricao || !status) {
             return res.status(400).json({ message: 'Para uma atualização completa (PUT), os campos titulo, descricao e status são obrigatórios.' });
        }
        if (!['aberto', 'solucionado'].includes(status)) {
            return res.status(400).json({ message: 'O campo "status" deve ser "aberto" ou "solucionado".' });
        }
        if (agente_id) {
             if(!UUID_REGEX.test(agente_id)) return res.status(400).json({ message: 'Formato de ID de agente inválido.' });
             const agente = await agentesRepository.findById(agente_id);
             if (!agente) return res.status(404).json({ message: 'Agente com o ID fornecido não foi encontrado.' });
        }

        const casoAtualizado = await casosRepository.update(id, { titulo, descricao, status, agente_id: agente_id || null });
        if (!casoAtualizado) {
            return res.status(404).json({ message: 'Caso não encontrado.' });
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao atualizar caso." });
    }
}


async function updateCasoParcial(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.id) {
            return res.status(400).json({ message: "O campo 'id' não pode ser alterado." });
        }
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        if (data.status && !['aberto', 'solucionado'].includes(data.status)) {
            return res.status(400).json({ message: 'O campo "status" deve ser "aberto" ou "solucionado".' });
        }
        if (data.agente_id) {
            if(!UUID_REGEX.test(data.agente_id)) return res.status(400).json({ message: 'Formato de ID de agente inválido.' });
            const agente = await agentesRepository.findById(data.agente_id);
            if (!agente) {
                return res.status(404).json({ message: 'Agente com o ID fornecido não foi encontrado.' });
            }
        }

        const casoAtualizado = await casosRepository.update(id, data);
        if (!casoAtualizado) {
            return res.status(404).json({ message: 'Caso não encontrado.' });
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao atualizar caso." });
    }
}


async function deleteCaso(req, res) {
    try {
        const { id } = req.params;
        if (!UUID_REGEX.test(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const success = await casosRepository.remove(id);
        if (!success) {
            return res.status(404).json({ message: 'Caso não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao deletar caso." });
    }
}

async function getAgenteByCasoId(req, res) {
    try {
        const { caso_id } = req.params;
        if (!UUID_REGEX.test(caso_id)) {
            return res.status(400).json({ message: 'Formato de ID de caso inválido.' });
        }
        const caso = await casosRepository.findById(caso_id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado.' });
        }
        if (!caso.agente_id) {
            return res.status(404).json({ message: 'Este caso não possui um agente associado.' });
        }
        const agente = await agentesRepository.findById(caso.agente_id);
        if (!agente) {
            return res.status(404).json({ message: 'Agente associado ao caso não foi encontrado.' });
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
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