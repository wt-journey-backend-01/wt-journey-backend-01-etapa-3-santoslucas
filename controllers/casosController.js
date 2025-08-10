const casosRepository = require('../repositories/casosRepository');

async function getAllCasos(req, res) {
  try {
    const casos = await casosRepository.findAll();
    res.json(casos);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function getCasoById(req, res) {
  try {
    const caso = await casosRepository.findById(req.params.id);
    if (!caso) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(caso);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function createCaso(req, res) {
  try {
    const novoCaso = await casosRepository.create(req.body);
    res.status(201).json(novoCaso);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar caso" });
  }
}

async function updateCaso(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.id) delete data.id;

    const casoAtualizado = await casosRepository.update(id, data);
    
    if (!casoAtualizado) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(casoAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar caso" });
  }
}

async function deleteCaso(req, res) {
  try {
    const success = await casosRepository.remove(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar caso" });
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
    
    res.json(agente);
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