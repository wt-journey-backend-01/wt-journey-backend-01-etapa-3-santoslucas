/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('agentes').del();

  await knex('agentes').insert([
    { nome: 'João Silva', dataDeIncorporacao: '2020-01-01', cargo: 'Detetive' },
    { nome: 'Maria Souza', dataDeIncorporacao: '2019-05-10', cargo: 'Investigadora' }
  ]).returning('*');
};

