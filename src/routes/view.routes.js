import { Router } from "express";
import {
    homePage,
    blogDetailPage,
    loginPage,
    registerPage,
    dashboardPage,
    newBlogPage,
    editBlogPage,
} from "../controllers/view.controller.js";
import { requireLogin } from "../middlewares/viewAuth.middleware.js";

const router = Router();

// ---- Public pages -----------
router.get("/", homePage);
router.get("/login", loginPage);
router.get("/register", registerPage);

// ---- Protected pages -------
router.get("/dashboard", requireLogin, dashboardPage);
router.get("/blogs/new", requireLogin, newBlogPage);
router.get("/blogs/:id/edit", requireLogin, editBlogPage);

// Public blog detail
router.get("/blogs/:id", blogDetailPage);

export default router;
