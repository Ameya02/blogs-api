const pgp = require('pg-promise')();
    const dbConfig = {
      user: 'postgres',
      password: 'root',
      database: 'blogsDB',
      host: '127.0.0.1',
      port: 5432
    };
    const db = pgp(dbConfig);
const callStoredProcedure = async (procedureName, ...args) => {
  const result = await db.func(procedureName, ...args);
  return result;
}

module.exports = {
  callStoredProcedure
};