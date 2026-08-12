import { asyncHandler } from "../utils/asyncHandler.js";
import { blogRepository } from "../repository/blog.repository.js";
import { userRepository } from "../repository/user.repository.js";
import { ROLES } from "../constants.js";

// ---- Public 

export const homePage = asyncHandler(async (req, res) => {
    // staff see all blogs (incl. unpublished); others see published
    const isStaff =
        req.user &&
        (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SUPERADMIN);

    const blogs = isStaff
        ? await blogRepository.listAllBlogs()
        : await blogRepository.listBlogs();

    res.render("public/home", { title: "Home", blogs });
});

export const blogDetailPage = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) {
        return res.status(404).render("error", {
            title: "Not found",
            message: "Blog not found",
            statusCode: 404,
        });
    }
    const comments = await blogRepository.listComments(blog.id);
    res.render("public/blog-detail", { title: blog.title, blog, comments });
});

// ---- Auth pages -

export const loginPage = asyncHandler(async (req, res) => {
    if (req.user) return res.redirect("/dashboard");
    res.render("auth/login", { title: "Login" });
});

export const registerPage = asyncHandler(async (req, res) => {
    if (req.user) return res.redirect("/dashboard");
    res.render("auth/register", { title: "Register" });
});

// ---- Dashboards -

// One entry point that routes each role to its own dashboard view.
export const dashboardPage = asyncHandler(async (req, res) => {
    const role = req.user.role;

    if (role === ROLES.SUPERADMIN) {
        const blogs = await blogRepository.listAllBlogs();
        const users = await userRepository.listAllUsers();
        return res.render("dashboard/superadmin", {
            title: "Super Admin",
            blogs,
            users,
        });
    }

    if (role === ROLES.ADMIN) {
        const blogs = await blogRepository.listAllBlogs();
        const users = await userRepository.listAllUsers();
        return res.render("dashboard/admin", { title: "Admin", blogs, users });
    }

    // regular user: only their own blogs
    const all = await blogRepository.listAllBlogs();
    const myBlogs = all.filter((b) => b.authorId === req.user.id);
    res.render("dashboard/user", { title: "Dashboard", blogs: myBlogs });
});

// ---- Blog create/edit forms ---------

export const newBlogPage = asyncHandler(async (req, res) => {
    res.render("dashboard/blog-form", {
        title: "New Blog",
        blog: null, // null = create mode
    });
});

export const editBlogPage = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) {
        return res.status(404).render("error", {
            title: "Not found",
            message: "Blog not found",
            statusCode: 404,
        });
    }
    res.render("dashboard/blog-form", { title: "Edit Blog", blog });
});