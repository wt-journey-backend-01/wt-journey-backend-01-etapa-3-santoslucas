
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const agentes = await knex('agentes').select('id', 'nome');
  if (agentes.length < 2) {
    throw new Error('Seed error: Not enough agents found in the database. Please run the agentes seed first.');
  }

  const mulder = agentes.find(a => a.nome === 'Fox Mulder');
  const scully = agentes.find(a => a.nome === 'Dana Scully');

  if (!mulder || !scully) {
    throw new Error('Seed error: Could not find required agents "Fox Mulder" or "Dana Scully".');
  }

  await knex('casos').insert([
    { 
      titulo: 'O Monstro da Semana', 
      descricao: 'Investigar uma estranha criatura em uma pequena cidade de Nova Jersey.', 
      status: 'aberto', 
      agente_id: mulder.id 
    },
    { 
      titulo: 'Conspiração Governamental', 
      descricao: 'Expor a verdade sobre a colaboração com extraterrestres.', 
      status: 'solucionado', 
      agente_id: scully.id 
    },
    { 
      titulo: 'Caso Não Atribuído', 
      descricao: 'Um misterioso desaparecimento que ainda não foi designado a um agente.', 
      status: 'aberto', 
      agente_id: null 
    }
  ]);
};
