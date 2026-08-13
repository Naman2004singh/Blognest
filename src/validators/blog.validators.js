import Joi from "joi";
import { CATEGORIES } from "../constants.js";

export const createBlogSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required().messages({
        "string.empty": "Title is required",
    }),
    description: Joi.string().trim().min(10).required().messages({
        "string.empty": "Story is required",
        "string.min": "Story must be at least 10 characters",
    }),
    category: Joi.string().valid(...CATEGORIES).required().messages({
        "any.only": "Choose a valid category",
        "string.empty": "Category is required",
    }),
});

export const updateBlogSchema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    description: Joi.string().trim().min(10),
    category: Joi.string().valid(...CATEGORIES),
    isPublished: Joi.boolean(),
}).min(1).messages({
    "object.min": "Provide at least one field to update",
});

export const commentSchema = Joi.object({
    content: Joi.string().trim().min(1).max(1000).required().messages({
        "string.empty": "Comment cannot be empty",
    }),
});
