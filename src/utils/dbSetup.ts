import { createPool } from 'mysql2/promise';

const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT, 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.getConnection()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(console.error);

export default connection;
module.exports = connection;
