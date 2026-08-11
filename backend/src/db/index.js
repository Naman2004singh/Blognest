import mysql from "mysql2/promise"

//  Connection Pool ->  A pool reuses a set of open connections instead of opening a new one for every query
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port : process.env.DB_PORT,

    connectionLimit : 10,
    waitForConnections :true,
    queueLimit : 0,
})

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL connected successfully");
        console.log(`DB host : ${connection.config.host}, DB : ${connection.config.database}`);
        

        connection.release();    // return it to the pool, don't close the pool
    } catch (error) {
        console.error("MySQL connection failed:", error);
        process.exit(1);
    }
};

export { pool };
export default connectDB;