import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT } from "./constants.js";
import { ApiError } from "./utils/ApiError.js";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from 'express-ejs-layouts';

// __dirname doesn't exist in ES modules, so we rebuild it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---- View engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// ---- Core middlewares
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

import { attachUser } from "./middlewares/viewAuth.middleware.js";
app.use(attachUser);

    // routes import
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js"
import adminRouter from "./routes/admin.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/admin", adminRouter);

// ---- Page Routes (server-rendered EJS)
import viewRouter from "./routes/view.routes.js";
app.use("/", viewRouter);

app.use((err, req, res, next) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

     // If the request is for the API, respond with JSON
    if (req.originalUrl.startsWith("/api")) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: err.errors || [],
        });
    }
    res.status(statusCode).render("error", { message, statusCode });
});

export { app };