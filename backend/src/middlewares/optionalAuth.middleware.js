import jwt from "jsonwebtoken";
import { userRepository } from "../repository/user.repository.js";

//  optionalJWT
//  For public routes that behave differently when logged in.
//  If a valid token is present, attach req.user. If not, just
//  continue as an visitor (never throws).

export const optionalJWT = async (req, _res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await userRepository.findById(decoded?.id);
            if (user) req.user = user;
        }
    } catch {
        // invalid/expired token, don't block
    }
    next();
};