const pgp = require('pg-promise')();
    const dbConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    };
    const db = pgp(dbConfig);
const callStoredProcedure = async (procedureName, ...args) => {
  const result = await db.func(procedureName, ...args);
  return result;
}

module.exports = {
  callStoredProcedure
};