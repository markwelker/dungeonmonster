// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
	password: 'dungeonmonster',
	database: 'dungeonmonster',
	charset: 'utf8'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'dungeonmonster',
      user:     'root',
      password: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

