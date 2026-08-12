import Joi from "joi";


export const registerSchema = Joi.object({
    fullName: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters",
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Enter a valid email",
    }),
    password: Joi.string().min(6).max(128).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
    }),
}); // no `role` here by design

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Enter a valid email",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});