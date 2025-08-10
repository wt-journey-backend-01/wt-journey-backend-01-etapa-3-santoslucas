exports.up = function(knex) {
  return knex.schema
    .createTable('agentes', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.date('dataDeIncorporacao').notNullable();
      table.string('cargo').notNullable();
    })
    .createTable('casos', (table) => {
      table.increments('id').primary();
      table.string('titulo').notNullable();
      table.string('descricao').notNullable();
      table.enu('status', ['aberto', 'solucionado']).notNullable();
      table.integer('agente_id').unsigned().references('id').inTable('agentes').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('casos')
    .dropTableIfExists('agentes');
};
