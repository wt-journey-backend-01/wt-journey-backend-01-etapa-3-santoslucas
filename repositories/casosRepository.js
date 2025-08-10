const db = require('../db/db');

function findAll() {
  return db('casos').select('*');
}

function findById(id) {
  return db('casos').where({ id }).first();
}

async function create(caso) {
  const [novoCaso] = await db('casos').insert(caso).returning('*');
  return novoCaso;
}

async function update(id, data) {
  const [casoAtualizado] = await db('casos').where({ id }).update(data).returning('*');
  return casoAtualizado;
}

async function remove(id) {
  const count = await db('casos').where({ id }).del();
  return count > 0;
}

function findByAgenteId(agenteId) {
  return db('casos').where({ agente_id: agenteId }).select('*');
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  findByAgenteId,
};