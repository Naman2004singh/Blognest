import { Router } from "express";
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    deleteComment,
    toggleLike,
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalJWT } from "../middlewares/optionalAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBlogSchema, updateBlogSchema, commentSchema } from "../validators/blog.validators.js";

const router = Router();

// ---- Public (optionalJWT)
router.route("/").get(optionalJWT, getAllBlogs);
router.route("/:id").get(getBlogById);

// ---- Create (any logged-in user)
router.route("/").post(
    verifyJWT,
    upload.single("thumbnail"),
    validate(createBlogSchema),
    createBlog
);

// ---- Update / Delete (owner or admin/superadmin)
router
    .route("/:id")
    .patch(verifyJWT, upload.single("thumbnail"), validate(updateBlogSchema), updateBlog)
    .delete(verifyJWT, deleteBlog);

// ---- Comments
router.route("/:id/comments").post(verifyJWT, validate(commentSchema), addComment);
router.route("/comments/:commentId").delete(verifyJWT, deleteComment);

// ---- Like (toggle)
router.route("/:id/like").post(verifyJWT, toggleLike);

export default router;