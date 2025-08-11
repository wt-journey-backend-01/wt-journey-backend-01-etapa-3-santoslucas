/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

  await knex('agentes').del();

  await knex('agentes').insert([
    { nome: 'Fox Mulder', dataDeIncorporacao: '1990-10-24', cargo: 'Agente Especial' },
    { nome: 'Dana Scully', dataDeIncorporacao: '1992-03-06', cargo: 'Agente Especial' },
    { nome: 'Walter Skinner', dataDeIncorporacao: '1986-11-15', cargo: 'Diretor Assistente' }
  ]);
};

