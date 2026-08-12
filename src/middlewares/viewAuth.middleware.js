import jwt from "jsonwebtoken";
import { userRepository } from "../repository/user.repository.js";
import { ROLES } from "../constants.js";


export const attachUser = async (req, res, next) => {
    res.locals.user = null; // default: not logged in
    try {
        const token = req.cookies?.accessToken;
        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await userRepository.findById(decoded?.id);
            if (user) {
                req.user = user;
                res.locals.user = user;
            }
        }
    } catch {
        // invalid/expired token -> stay anonymous
    }
    next();
};


export const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
};


export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.redirect("/login");
        if (!roles.includes(req.user.role)) return res.redirect("/");
        next();
    };
};
