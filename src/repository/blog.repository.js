import { pool } from "../db/index.js";

//  Blog Repository — all SQL for blogs, comments, likes.

// List published blogs with author name + like/comment counts.
const listBlogs = async () => {
    const [rows] = await pool.execute(
        `SELECT b.id, b.title, b.description, b.category, b.thumbnail,
                b.isPublished, b.createdAt, b.updatedAt,
                u.fullName AS authorName, b.author AS authorId,
                (SELECT COUNT(*) FROM likes    WHERE blog = b.id) AS likeCount,
                (SELECT COUNT(*) FROM comments WHERE blog = b.id) AS commentCount
        FROM blogs b
        JOIN users u ON u.id = b.author
        WHERE b.isPublished = TRUE
        ORDER BY b.createdAt DESC`
    );
    return rows;
};

// Admins/superadmins see everything (published + unpublished).
const listAllBlogs = async () => {
    const [rows] = await pool.execute(
        `SELECT b.id, b.title, b.description, b.category, b.thumbnail,
                b.isPublished, b.createdAt, b.updatedAt,
                u.fullName AS authorName, b.author AS authorId,
                (SELECT COUNT(*) FROM likes    WHERE blog = b.id) AS likeCount,
                (SELECT COUNT(*) FROM comments WHERE blog = b.id) AS commentCount
        FROM blogs b
        JOIN users u ON u.id = b.author
        ORDER BY b.createdAt DESC`
    );
    return rows;
};

const findBlogById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT b.*, u.fullName AS authorName,
                (SELECT COUNT(*) FROM likes    WHERE blog = b.id) AS likeCount,
                (SELECT COUNT(*) FROM comments WHERE blog = b.id) AS commentCount
        FROM blogs b
        JOIN users u ON u.id = b.author
        WHERE b.id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
};

const createBlog = async ({ title, description, category, thumbnail, author }) => {
    const [result] = await pool.execute(
        `INSERT INTO blogs (title, description, category, thumbnail, author)
        VALUES (?, ?, ?, ?, ?)`,
        [title, description, category, thumbnail, author]
    );
    return findBlogById(result.insertId);
};

// Dynamic UPDATE: only set the fields that were provided.
const updateBlog = async (id, fields) => {
    const allowed = ["title", "description", "category", "thumbnail", "isPublished"];
    const keys = Object.keys(fields).filter((k) => allowed.includes(k));
    if (keys.length === 0) return findBlogById(id);

    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => fields[k]);

    await pool.execute(`UPDATE blogs SET ${setClause} WHERE id = ?`, [...values, id]);
    return findBlogById(id);
};

const deleteBlog = async (id) => {
    await pool.execute(`DELETE FROM blogs WHERE id = ?`, [id]);
};

// ---- Comments ------------------------------------------------

const addComment = async ({ content, blog, author }) => {
    const [result] = await pool.execute(
        `INSERT INTO comments (content, blog, author) VALUES (?, ?, ?)`,
        [content, blog, author]
    );
    const [rows] = await pool.execute(
        `SELECT c.id, c.content, c.createdAt, u.fullName AS authorName, c.author AS authorId
        FROM comments c JOIN users u ON u.id = c.author
        WHERE c.id = ?`,
        [result.insertId]
    );
    return rows[0];
};

const listComments = async (blogId) => {
    const [rows] = await pool.execute(
        `SELECT c.id, c.content, c.createdAt, u.fullName AS authorName, c.author AS authorId
        FROM comments c JOIN users u ON u.id = c.author
        WHERE c.blog = ? ORDER BY c.createdAt DESC`,
        [blogId]
    );
    return rows;
};

const findCommentById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT * FROM comments WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
};

const deleteComment = async (id) => {
    await pool.execute(`DELETE FROM comments WHERE id = ?`, [id]);
};

// ---- Likes (toggle) ------------------------------------------

const findLike = async (blog, user) => {
    const [rows] = await pool.execute(
        `SELECT id FROM likes WHERE blog = ? AND user = ? LIMIT 1`,
        [blog, user]
    );
    return rows[0] || null;
};

const addLike = async (blog, user) => {
    await pool.execute(`INSERT INTO likes (blog, user) VALUES (?, ?)`, [blog, user]);
};

const removeLike = async (blog, user) => {
    await pool.execute(`DELETE FROM likes WHERE blog = ? AND user = ?`, [blog, user]);
};

const countLikes = async (blog) => {
    const [rows] = await pool.execute(
        `SELECT COUNT(*) AS count FROM likes WHERE blog = ?`,
        [blog]
    );
    return rows[0].count;
};

export const blogRepository = {
    listBlogs,
    listAllBlogs,
    findBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    listComments,
    findCommentById,
    deleteComment,
    findLike,
    addLike,
    removeLike,
    countLikes,
};