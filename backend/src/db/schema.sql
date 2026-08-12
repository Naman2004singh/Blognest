CREATE DATABASE IF NOT EXISTS blog_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE blog_db;

-- USER------------
CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(100) NOT NULL UNIQUE,
    fullName     VARCHAR(100) NOT NULL,
    avatar       VARCHAR(255) NOT NULL,
    coverImage   VARCHAR(255) DEFAULT NULL,
    password     VARCHAR(255) NOT NULL,
    role         ENUM('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user',
    refreshToken VARCHAR(512) DEFAULT NULL,
    createdAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_fullName (fullName),
    INDEX idx_role (role)
) ENGINE=InnoDB;


-- BLOG -------------
CREATE TABLE IF NOT EXISTS blogs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category    VARCHAR(50) NOT NULL,
    thumbnail   VARCHAR(255) NOT NULL,
    isPublished BOOLEAN NOT NULL DEFAULT TRUE,
    author      INT NOT NULL,
    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author),
    INDEX idx_category (category)
) ENGINE=InnoDB;


-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    content   TEXT NOT NULL,
    blog      INT NOT NULL,
    author    INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (blog)   REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_blog (blog)
) ENGINE=InnoDB;


-- LIKES
CREATE TABLE IF NOT EXISTS likes (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    blog      INT NOT NULL,
    user      INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (blog) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_like (blog, user)
) ENGINE=InnoDB;