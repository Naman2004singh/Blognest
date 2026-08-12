import { ApiError } from "../utils/ApiError.js";

// ============================================================
//  authorizeRoles(...allowedRoles)
//  Gate a route to specific roles. Must run AFTER verifyJWT
//  (which sets req.user).
//
//  This is the backend enforcement of the permission table —
//  the EJS frontend may hide buttons, but the real check is here.
//
//  Usage:
//    router.post("/admin/create-user",
//        verifyJWT,
//        authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN),
//        createUser
//    );
// ============================================================
export const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403,
                "You do not have permission to perform this action"
            );
        }

        next();
    };
};