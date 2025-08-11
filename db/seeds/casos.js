/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('casos').del();

  const agentes = await knex('agentes').select('id');

  await knex('casos').insert([
    { titulo: 'Roubo no centro', descricao: 'Roubo a mão armada', status: 'aberto', agente_id: agentes[0].id },
    { titulo: 'Fraude bancária', descricao: 'Esquema de fraude', status: 'solucionado', agente_id: agentes[1].id }
  ]);
};

