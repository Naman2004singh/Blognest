import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { userRepository } from "../repository/user.repository.js";
import { ROLES, DEFAULT_AVATAR } from "../constants.js";

// List every user (admins + members).
const listUsers = asyncHandler(async (req, res) => {
    const users = await userRepository.listAllUsers();
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

// Create an admin account
const createAdmin = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const exists = await userRepository.existsByEmail(email);
    if (exists) {
        throw new ApiError(409, "A user with this email already exists");
    }

    const admin = await userRepository.createUser({
        fullName,
        email,
        password,
        avatar: DEFAULT_AVATAR,
        coverImage: null,
        role: ROLES.ADMIN,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, admin, "Admin created successfully"));
});


const deleteUser = asyncHandler(async (req, res) => {
    const targetId = Number(req.params.id);

    if (targetId === req.user.id) {
        throw new ApiError(400, "You cannot delete your own account");
    }

    const target = await userRepository.findById(targetId);
    if (!target) {
        throw new ApiError(404, "User not found");
    }

    // super admin is never deletable, by anyone
    if (target.role === ROLES.SUPERADMIN) {
        throw new ApiError(403, "A super admin cannot be deleted");
    }

    // an admin may only remove regular members
    if (req.user.role === ROLES.ADMIN && target.role !== ROLES.USER) {
        throw new ApiError(403, "Admins can only remove members");
    }

    await userRepository.deleteUser(targetId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export { listUsers, createAdmin, deleteUser };