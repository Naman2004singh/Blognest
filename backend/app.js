import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT } from "./constants.js";

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



export { app };