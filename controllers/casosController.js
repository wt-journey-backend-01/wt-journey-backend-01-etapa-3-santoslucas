const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { formatError } = require('../utils/errorHandler');

// Funções utilitárias de validação
function validateAllowedFields(data, allowedFields) {
    const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
    return invalidFields.length > 0 ? 
        { invalidFields: `Campos inválidos no corpo da requisição: ${invalidFields.join(', ')}` } : 
        null;
}

function validateStringField(value, fieldName, isRequired = false) {
    const errors = [];
    
    if (isRequired && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors.push({ [fieldName]: `O campo '${fieldName}' é obrigatório` });
    } else if (value && typeof value !== 'string') {
        errors.push({ [fieldName]: `O campo '${fieldName}' deve ser uma string` });
    } else if (value && typeof value === 'string' && value.trim() === '') {
        errors.push({ [fieldName]: `O campo '${fieldName}' não pode estar vazio` });
    }
    
    return errors;
}

function validateStatusField(status, isRequired = false) {
    const errors = [];
    const validStatuses = ['aberto', 'solucionado'];
    
    if (isRequired && !status) {
        errors.push({ status: "O campo 'status' é obrigatório" });
    } else if (status && (!validStatuses.includes(status.toLowerCase()))) {
        errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
    }
    
    return errors;
}

function validateAgenteId(agente_id, isRequired = false) {
    const errors = [];
    
    if (isRequired && (!agente_id || typeof agente_id !== 'string' || agente_id.trim() === '')) {
        errors.push({ agente_id: "O campo 'agente_id' é obrigatório e deve ser uma string válida" });
    } else if (agente_id !== undefined) {
        if (typeof agente_id !== 'string' || agente_id.trim() === '') {
            errors.push({ agente_id: "O campo 'agente_id' deve ser uma string válida" });
        } else if (!agentesRepository.findById(agente_id.trim())) {
            errors.push({ agente_id: "O 'agente_id' fornecido não corresponde a um agente existente" });
        }
    }
    
    return errors;
}

function collectValidationErrors(...errorArrays) {
    return errorArrays.flat().filter(error => error !== null);
}

function getAllCasos(req, res) {
    let casos = casosRepository.findAll();

    if (req.query.status) {
        casos = casos.filter(caso => caso.status.toLowerCase() === req.query.status.toLowerCase());
    }

    if (req.query.agente_id) {
        const agenteIdQuery = req.query.agente_id.trim();
        casos = casos.filter(caso => caso.agente_id === agenteIdQuery);
    }
    
    if (req.query.q) {
        const query = req.query.q.trim();
        if (query.length > 0) {
            const queryLower = query.toLowerCase();
            casos = casos.filter(caso => {
                const titulo = caso.titulo ? caso.titulo.toLowerCase() : '';
                const descricao = caso.descricao ? caso.descricao.toLowerCase() : '';
                return titulo.includes(queryLower) || descricao.includes(queryLower);
            });
        }
    }

    res.json(casos);
}

function getCasoById(req, res) {
    const caso = casosRepository.findById(req.params.id);
    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(caso);
}

function createCaso(req, res) {
    const { titulo, descricao, status, agente_id } = req.body;
    const allowedFields = ['titulo', 'descricao', 'status', 'agente_id'];
    
    const errors = collectValidationErrors(
        [validateAllowedFields(req.body, allowedFields)],
        validateStringField(titulo, 'titulo', true),
        validateStringField(descricao, 'descricao', true),
        validateStatusField(status, true),
        validateAgenteId(agente_id, true)
    );

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const newCaso = casosRepository.create({ 
        titulo: titulo.trim(), 
        descricao: descricao.trim(), 
        status: status.toLowerCase(), 
        agente_id: agente_id.trim() 
    });
    res.status(201).json(newCaso);
}

function updateCaso(req, res) {
    const { id } = req.params;
    const { id: bodyId, ...data } = req.body;
    if (bodyId && bodyId !== id) {
        return res.status(400).json({ message: "Não é permitido alterar o campo 'id'." });
    }
    
    const { titulo, descricao, status, agente_id } = data;
    const allowedFields = ['titulo', 'descricao', 'status', 'agente_id'];
    
    const errors = collectValidationErrors(
        [validateAllowedFields(data, allowedFields)],
        validateStringField(titulo, 'titulo', true),
        validateStringField(descricao, 'descricao', true),
        validateStatusField(status, true),
        validateAgenteId(agente_id, true)
    );

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedCaso = casosRepository.update(id, { 
        titulo: titulo.trim(), 
        descricao: descricao.trim(), 
        status: status.toLowerCase(), 
        agente_id: agente_id.trim() 
    });
    if (!updatedCaso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(updatedCaso);
}

function patchCaso(req, res) {
    const { id } = req.params;
    const { id: bodyId, ...updates } = req.body;
    if (bodyId && bodyId !== id) {
        return res.status(400).json({ message: "Não é permitido alterar o campo 'id'." });
    }
    
    const allowedFields = ['titulo', 'descricao', 'status', 'agente_id'];
    
    const errors = collectValidationErrors(
        [validateAllowedFields(updates, allowedFields)],
        validateStringField(updates.titulo, 'titulo', false),
        validateStringField(updates.descricao, 'descricao', false),
        validateStatusField(updates.status, false),
        validateAgenteId(updates.agente_id, false)
    );
    
    if (Object.keys(updates).length === 0) {
        errors.push({ body: "O corpo da requisição não pode estar vazio para um PATCH." });
    }

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const cleanUpdates = { ...updates };
    if (cleanUpdates.titulo) cleanUpdates.titulo = cleanUpdates.titulo.trim();
    if (cleanUpdates.descricao) cleanUpdates.descricao = cleanUpdates.descricao.trim();
    if (cleanUpdates.status) cleanUpdates.status = cleanUpdates.status.toLowerCase();
    if (cleanUpdates.agente_id) cleanUpdates.agente_id = cleanUpdates.agente_id.trim();

    const updatedCaso = casosRepository.update(id, cleanUpdates);
    if (!updatedCaso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(updatedCaso);
}

function deleteCaso(req, res) {
    const success = casosRepository.remove(req.params.id);
    if (!success) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(204).send();
}

function getAgenteByCasoId(req, res) {
    const caso = casosRepository.findById(req.params.caso_id);
    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    const agente = agentesRepository.findById(caso.agente_id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente responsável pelo caso não encontrado' });
    }
    res.json(agente);
}

async function findCasosByAgente(req, res) {
  try {
    const { id } = req.params;
    const casos = await casosRepository.findByAgenteId(id);

    if (casos.length === 0) {
      return res.status(404).json({ message: "Nenhum caso encontrado para este agente ou o agente não existe." });
    }
    
    res.status(200).json(casos);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    patchCaso,
    deleteCaso,
    getAgenteByCasoId,
    findCasosByAgente,
};
