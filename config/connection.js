import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER || 'esports_user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'esports',
    waitForConnections: true,
    connectionLimit: 10
});

export async function connect() {
    const connection = await pool.getConnection();
    connection.release();
    return pool;
}

export default connect;