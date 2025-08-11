const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

async function getAllCasos(req, res) {
    try {
        const casos = await casosRepository.findAll(req.query);
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor" });
    }
}

async function getCasoById(req, res) {
    try {
        const { id } = req.params;
        const caso = await casosRepository.findById(id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor" });
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

async function updateCaso(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        
        if (data.id) {
            return res.status(400).json({ message: "Não é permitido alterar o campo 'id'." });
        }
        if (data.status && !['aberto', 'solucionado'].includes(data.status)) {
            return res.status(400).json({ message: 'O campo "status" deve ser "aberto" ou "solucionado".' });
        }
        if (data.agente_id) {
            const agente = await agentesRepository.findById(data.agente_id);
            if (!agente) {
                return res.status(404).json({ message: 'Agente com o ID fornecido não foi encontrado.' });
            }
        }

        const casoAtualizado = await casosRepository.update(id, data);
        if (!casoAtualizado) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao atualizar caso." });
    }
}

async function deleteCaso(req, res) {
    try {
        const { id } = req.params;
        const success = await casosRepository.remove(id);
        if (!success) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao deletar caso." });
    }
}

async function getAgenteByCasoId(req, res) {
    try {
        const { caso_id } = req.params;
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
    updateCaso,
    deleteCaso,
    getAgenteByCasoId,
};