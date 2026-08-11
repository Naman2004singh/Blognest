CREATE DATABASE IF NOT EXISTS blog_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE blog_db;

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