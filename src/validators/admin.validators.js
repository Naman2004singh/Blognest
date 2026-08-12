import Joi from "joi";

// Super admin creating an admin: name, email, password.
export const createAdminSchema = Joi.object({
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
});