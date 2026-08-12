import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userRepository } from "../repository/user.repository.js";


export const verifyJWT = asyncHandler(async (req, _res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await userRepository.findById(decoded?.id);
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user; // { id, email, fullName, avatar, coverImage, role, ... }
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});