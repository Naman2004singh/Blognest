import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/user.validators.js";

const router = Router();

// ---- Public routes ------------------------------------------

// Order matters: multer parses multipart FIRST (so text fields land in
// req.body), THEN Joi validates req.body, THEN the controller runs.
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    validate(registerSchema),
    registerUser
);

router.route("/login").post(validate(loginSchema), loginUser);

// ---- Secured routes -----------------------------------------
router.route("/logout").post(verifyJWT, logoutUser);

export default router;