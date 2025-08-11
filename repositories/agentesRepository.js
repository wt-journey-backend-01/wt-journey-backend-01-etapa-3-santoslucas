const db = require('../db/db');

async function findAll(filters) {
  const query = db('agentes');

  if (filters?.cargo) {
    query.where('cargo', 'ilike', `%${filters.cargo}%`);
  }

  if (filters?.dataDeIncorporacaoInicio) {
    query.whereRaw('"dataDeIncorporacao" >= ?::date', [filters.dataDeIncorporacaoInicio]);
  }
  if (filters?.dataDeIncorporacaoFim) {
    query.whereRaw('"dataDeIncorporacao" <= ?::date', [filters.dataDeIncorporacaoFim]);
  }

  // sorting: apply after filters
  if (filters?.sort) {
    const order = filters.sort.startsWith('-') ? 'desc' : 'asc';
    const column = filters.sort.replace('-', '');

    const validSortColumns = ['nome', 'dataDeIncorporacao', 'cargo'];
    if (validSortColumns.includes(column)) {
      // Use orderByRaw with quoted column name to avoid case-sensitive issues
      query.orderByRaw(`"${column}" ${order}`);
    }
  }

  const rows = await query.select('*');
  return rows;
}

async function findById(id) {
  const agente = await db('agentes').where({ id }).first();
  return agente;
}

async function create(agente) {
  const [novoAgente] = await db('agentes').insert(agente).returning('*');
  return novoAgente;
}

async function update(id, data) {
  // Ensure the record exists before updating to allow controllers to return 404 reliably
  const existing = await findById(id);
  if (!existing) return null;

  const [agenteAtualizado] = await db('agentes').where({ id }).update(data).returning('*');
  return agenteAtualizado;
}

async function remove(id) {
  const count = await db('agentes').where({ id }).del();
  return count > 0;
}

module.exports = { findAll, findById, create, update, remove };
