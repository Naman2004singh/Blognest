import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port : process.env.DB_PORT,

    connectionLimit : 10,
    waitForConnections :true,
})

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL connected successfully");

        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error);

        process.exit(1);
    }
};

export {pool, connectDB}