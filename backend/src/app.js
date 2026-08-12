import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT } from "./constants.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({  // will accept the json format
    limit : LIMIT       
}))

app.use(express.urlencoded({
    extended : true,    // used to give the extended(nested object) in the url
    limit : LIMIT
}))

// to store the files temporarly on the server
app.use(express.static("public"))

// can access the browser cookie from the server
app.use(cookieParser())

    // routes import
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

app.use((err, req, res, next) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
});

export { app };