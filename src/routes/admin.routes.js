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

// Every route here requires a logged-in SUPER ADMIN.
router.use(verifyJWT, authorizeRoles(ROLES.SUPERADMIN));

router.route("/users").get(listUsers);
router.route("/admins").post(validate(createAdminSchema), createAdmin);
router.route("/users/:id").delete(deleteUser);

export default router;