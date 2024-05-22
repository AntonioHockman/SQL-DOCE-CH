const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'W713762@dh', // ! Change this to your own password
  database: 'company_info',
  port: 5432 // Default PostgreSQL port
});
module.exports = pool;
