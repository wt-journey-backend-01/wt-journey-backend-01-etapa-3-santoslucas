const db = require('../db/db');

async function findAll() {
  return await db('agentes').select('*');
}

async function findById(id) {
  return await db('agentes').where({ id }).first();
}

async function create(agente) {
  const [novoAgente] = await db('agentes').insert(agente).returning('*');
  return novoAgente;
}

async function update(id, data) {
  const [agenteAtualizado] = await db('agentes').where({ id }).update(data).returning('*');
  return agenteAtualizado;
}

async function remove(id) {
  const count = await db('agentes').where({ id }).del();
  return count > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};