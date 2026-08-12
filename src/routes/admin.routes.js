import { Router } from "express";
import {
    listUsers,
    createAdmin,
    deleteUser,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAdminSchema } from "../validators/admin.validators.js";
import { ROLES } from "../constants.js";

const router = Router();

// All admin routes require login.
router.use(verifyJWT);

// List users — admin AND super admin.
router.route("/users").get(authorizeRoles(ROLES.ADMIN, ROLES.SUPERADMIN), listUsers);

// Delete a user 
router
    .route("/users/:id")
    .delete(authorizeRoles(ROLES.ADMIN, ROLES.SUPERADMIN), deleteUser);

// Create an admin — SUPER ADMIN ONLY.
router
    .route("/admins")
    .post(authorizeRoles(ROLES.SUPERADMIN), validate(createAdminSchema), createAdmin);

export default router;