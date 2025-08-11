const db = require('../db/db');

async function findAll(filters) {
  const query = db('agentes');

  if (filters?.cargo) {
    query.where('cargo', 'ilike', `%${filters.cargo}%`);
  }

  if (filters?.dataIncorporacaoInicio) {
    query.where('dataDeIncorporacao', '>=', filters.dataIncorporacaoInicio);
  }
  if (filters?.dataIncorporacaoFim) {
    query.where('dataDeIncorporacao', '<=', filters.dataIncorporacaoFim);
  }

  if (filters?.sort) {
    const order = filters.sort.startsWith('-') ? 'desc' : 'asc';
    const column = filters.sort.replace('-', '');
    
    const validSortColumns = ['nome', 'dataDeIncorporacao', 'cargo'];
    if (validSortColumns.includes(column)) {
        query.orderBy(column, order);
    }
  }

  return await query.select('*');
}

async function findById(id) {
  return db('agentes').where({ id }).first();
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

module.exports = { findAll, findById, create, update, remove };