
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => {
    return (req, _res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,   // collect ALL errors, not just the first
            stripUnknown: true,  // drop any field not in the schema (e.g. a sneaky `role`)
        });

        if (error) {
            const messages = error.details.map((d) => d.message);
            throw new ApiError(400, messages[0], messages);
        }

        req.body = value;
        next();
    };
};
