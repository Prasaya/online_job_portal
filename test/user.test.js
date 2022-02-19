require('dotenv').config({ path: './config/.env' });
const { createPool } = require('mysql2/promise');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let pool;
beforeAll(async () => {
  pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    password: process.env.DB_PASSWORD,
    database: 'webapp',
  });
});

test('dummy', async () => {
  expect(true).toBe(true);
});
