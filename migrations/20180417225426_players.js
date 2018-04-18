
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('players', function(table) {
      table.string('name').primary();
      table.string('password');
      table.string('class');
	  table.string('picture');
	  table.string('sheet');
	  table.string('maxhp');
	  table.string('hp');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('players'),
  ]);
};
