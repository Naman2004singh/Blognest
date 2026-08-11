import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./src/db/index.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
    .then( () => {

        // after the sucessfull connection, we have register this event listner
        app.on("error", (error) => {
            console.log("ERR : ", error);
            process.exit(1);  
        })

        app.listen(PORT, () => {
            console.log(`Server is ruunig on port ${PORT}` );     
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    })