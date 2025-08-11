const db = require('../db/db');

async function findAll(filters) {
    const query = db('casos');

    if (filters?.status) {
        query.where('status', filters.status);
    }
    if (filters?.agente_id) {
        query.where('agente_id', filters.agente_id);
    }
    if (filters?.q) {
        query.where((builder) => {
            builder.where('titulo', 'ilike', `%${filters.q}%`)
                   .orWhere('descricao', 'ilike', `%${filters.q}%`);
        });
    }

    const rows = await query.select('*');
    return rows;
}

async function findById(id) {
    const caso = await db('casos').where({ id }).first();
    return caso;
}

async function create(caso) {
    const [novoCaso] = await db('casos').insert(caso).returning('*');
    return novoCaso;
}

async function update(id, data) {
    const existing = await findById(id);
    if (!existing) return null;

    const [casoAtualizado] = await db('casos').where({ id }).update(data).returning('*');
    return casoAtualizado;
}

async function remove(id) {
    const count = await db('casos').where({ id }).del();
    return count > 0;
}

async function findByAgenteId(agente_id) {
    const rows = await db('casos').where({ agente_id }).select('*');
    return rows;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  findByAgenteId
};
