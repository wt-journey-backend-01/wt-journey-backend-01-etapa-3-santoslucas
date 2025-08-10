const agentesRepository = require('../repositories/agentesRepository');
const { formatError } = require('../utils/errorHandler');

function getAllAgentes(req, res) {
    let agentes = agentesRepository.findAll();

    if (req.query.cargo) {
        const cargoQuery = req.query.cargo.trim();
        if (cargoQuery.length > 0) {
            agentes = agentes.filter(agente => 
                agente.cargo && agente.cargo.toLowerCase() === cargoQuery.toLowerCase()
            );
        }
    }

    if (req.query.sort) {
        const sortField = req.query.sort.replace('-', '');
        if (sortField === 'dataDeIncorporacao') {
            agentes.sort((a, b) => {
                // Verificar se as datas são válidas
                const dateA = a.dataDeIncorporacao ? new Date(a.dataDeIncorporacao) : null;
                const dateB = b.dataDeIncorporacao ? new Date(b.dataDeIncorporacao) : null;
                
                // Tratar datas inválidas - colocar no final
                if (!dateA || isNaN(dateA.getTime())) {
                    return 1; // A vai para o final
                }
                if (!dateB || isNaN(dateB.getTime())) {
                    return -1; // B vai para o final
                }
                
                return req.query.sort.startsWith('-') ? dateB - dateA : dateA - dateB;
            });
        }
    }

    res.json(agentes);
}

function getAgenteById(req, res) {
    const agente = agentesRepository.findById(req.params.id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(agente);
}

function createAgente(req, res) {
    const { nome, dataDeIncorporacao, cargo } = req.body;
    const errors = [];

    // Validar campos permitidos
    const allowedFields = ['nome', 'dataDeIncorporacao', 'cargo'];
    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        errors.push({ invalidFields: `Campos inválidos no corpo da requisição: ${invalidFields.join(', ')}` });
    }

    // Validar tipos de campos
    if (nome && typeof nome !== 'string') {
        errors.push({ nome: "O campo 'nome' deve ser uma string" });
    }
    if (cargo && typeof cargo !== 'string') {
        errors.push({ cargo: "O campo 'cargo' deve ser uma string" });
    }

    if (!nome) errors.push({ nome: "O campo 'nome' é obrigatório" });
    if (!dataDeIncorporacao) errors.push({ dataDeIncorporacao: "O campo 'dataDeIncorporacao' é obrigatório" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)) {
        errors.push({ dataDeIncorporacao: "Campo 'dataDeIncorporacao' deve seguir a formatação 'YYYY-MM-DD'" });
    }
    if (dataDeIncorporacao && new Date(dataDeIncorporacao) > new Date()) {
        errors.push({ dataDeIncorporacao: "A data de incorporação não pode ser maior que a data atual" });
    }
    if (!cargo) errors.push({ cargo: "O campo 'cargo' é obrigatório" });

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const newAgente = agentesRepository.create({ nome, dataDeIncorporacao, cargo });
    res.status(201).json(newAgente);
}

function updateAgente(req, res) {
    const { id } = req.params;
    const { id: bodyId, ...data } = req.body; // remove id do corpo
    if (bodyId && bodyId !== id) {
        return res.status(400).json({ message: "Não é permitido alterar o campo 'id'." });
    }
    const { nome, dataDeIncorporacao, cargo } = data;
    const errors = [];

    // Validar campos permitidos
    const allowedFields = ['nome', 'dataDeIncorporacao', 'cargo'];
    const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        errors.push({ invalidFields: `Campos inválidos no corpo da requisição: ${invalidFields.join(', ')}` });
    }

    // Validar tipos de campos
    if (nome && typeof nome !== 'string') {
        errors.push({ nome: "O campo 'nome' deve ser uma string" });
    }
    if (cargo && typeof cargo !== 'string') {
        errors.push({ cargo: "O campo 'cargo' deve ser uma string" });
    }

    if (!nome) errors.push({ nome: "O campo 'nome' é obrigatório" });
    if (!dataDeIncorporacao) errors.push({ dataDeIncorporacao: "O campo 'dataDeIncorporacao' é obrigatório" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)) {
        errors.push({ dataDeIncorporacao: "Campo 'dataDeIncorporacao' deve seguir a formatação 'YYYY-MM-DD'" });
    }
    if (dataDeIncorporacao && new Date(dataDeIncorporacao) > new Date()) {
        errors.push({ dataDeIncorporacao: "A data de incorporação não pode ser maior que a data atual" });
    }
    if (!cargo) errors.push({ cargo: "O campo 'cargo' é obrigatório" });

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedAgente = agentesRepository.update(id, data);
    if (!updatedAgente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(updatedAgente);
}

function patchAgente(req, res) {
    const { id } = req.params;
    const { id: bodyId, ...updates } = req.body; // remove id do corpo
    if (bodyId && bodyId !== id) {
        return res.status(400).json({ message: "Não é permitido alterar o campo 'id'." });
    }
    const errors = [];

    // Validar campos permitidos
    const allowedFields = ['nome', 'dataDeIncorporacao', 'cargo'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        errors.push({ invalidFields: `Campos inválidos no corpo da requisição: ${invalidFields.join(', ')}` });
    }

    // Validar tipos de campos
    if (updates.nome && typeof updates.nome !== 'string') {
        errors.push({ nome: "O campo 'nome' deve ser uma string" });
    }
    if (updates.cargo && typeof updates.cargo !== 'string') {
        errors.push({ cargo: "O campo 'cargo' deve ser uma string" });
    }

    if (updates.dataDeIncorporacao && !/^\d{4}-\d{2}-\d{2}$/.test(updates.dataDeIncorporacao)) {
        errors.push({ dataDeIncorporacao: "Campo 'dataDeIncorporacao' deve seguir a formatação 'YYYY-MM-DD'" });
    }
    
    if (updates.dataDeIncorporacao && new Date(updates.dataDeIncorporacao) > new Date()) {
        errors.push({ dataDeIncorporacao: "A data de incorporação não pode ser maior que a data atual" });
    }
    
    if (Object.keys(updates).length === 0) {
        errors.push({ body: "O corpo da requisição não pode estar vazio para um PATCH." });
    }

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedAgente = agentesRepository.update(id, updates);
    if (!updatedAgente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(updatedAgente);
}

function deleteAgente(req, res) {
    const success = agentesRepository.remove(req.params.id);
    if (!success) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.status(204).send();
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    patchAgente,
    deleteAgente
};
