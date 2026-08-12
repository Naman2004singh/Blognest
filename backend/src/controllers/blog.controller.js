import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { blogRepository } from "../repository/blog.repository.js";
import { ROLES } from "../constants.js";

// Can this user modify this blog? Owner, admin, or superadmin only.
const canModify = (user, blog) => {
    if (!user || !blog) return false;
    if (user.role === ROLES.ADMIN || user.role === ROLES.SUPERADMIN) return true;
    return blog.author === user.id; // owner
};

//  PUBLIC — anyone can view published blogs (no login)

const getAllBlogs = asyncHandler(async (req, res) => {
    // Admins/superadmins see all (incl. unpublished); others see published.
    const isStaff =
        req.user &&
        (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SUPERADMIN);

    const blogs = isStaff
        ? await blogRepository.listAllBlogs()
        : await blogRepository.listBlogs();

    return res
        .status(200)
        .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    const comments = await blogRepository.listComments(blog.id);

    return res
        .status(200)
        .json(new ApiResponse(200, { blog, comments }, "Blog fetched successfully"));
});

//  CREATE — any logged-in user (thumbnail required)
const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required");

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) throw new ApiError(400, "Thumbnail upload failed");

    const blog = await blogRepository.createBlog({
        title,
        description,
        category,
        thumbnail: thumbnail.url,
        author: req.user.id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, blog, "Blog created successfully"));
});

//  UPDATE — owner, admin, or superadmin
const updateBlog = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    if (!canModify(req.user, blog)) {
        throw new ApiError(403, "You cannot edit this blog");
    }

    const fields = { ...req.body }; // title/description/category/isPublished

    // optional new thumbnail
    if (req.file?.path) {
        const thumbnail = await uploadOnCloudinary(req.file.path);
        if (thumbnail) fields.thumbnail = thumbnail.url;
    }

    const updated = await blogRepository.updateBlog(blog.id, fields);

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Blog updated successfully"));
});

//  DELETE — owner, admin, or superadmin
const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    if (!canModify(req.user, blog)) {
        throw new ApiError(403, "You cannot delete this blog");
    }

    await blogRepository.deleteBlog(blog.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

//  COMMENTS
const addComment = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    const comment = await blogRepository.addComment({
        content: req.body.content,
        blog: blog.id,
        author: req.user.id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const comment = await blogRepository.findCommentById(req.params.commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // comment author, admin, or superadmin can delete
    const isStaff =
        req.user.role === ROLES.ADMIN || req.user.role === ROLES.SUPERADMIN;
    if (comment.author !== req.user.id && !isStaff) {
        throw new ApiError(403, "You cannot delete this comment");
    }

    await blogRepository.deleteComment(comment.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

//  LIKE (toggle) — any logged-in user
const toggleLike = asyncHandler(async (req, res) => {
    const blog = await blogRepository.findBlogById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    const existing = await blogRepository.findLike(blog.id, req.user.id);

    if (existing) {
        await blogRepository.removeLike(blog.id, req.user.id);
    } else {
        await blogRepository.addLike(blog.id, req.user.id);
    }

    const likeCount = await blogRepository.countLikes(blog.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            { liked: !existing, likeCount },
            existing ? "Like removed" : "Blog liked"
        )
    );
});

export {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    deleteComment,
    toggleLike,
};