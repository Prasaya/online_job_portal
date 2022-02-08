import { createPool } from 'mysql2/promise';

const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(
        process.env.DB_PORT || '3306',
        10,
    ),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default connection;
