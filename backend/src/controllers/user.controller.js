import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isPasswordCorrect } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { userRepository } from "../repository/user.repository.js";
import { ROLES } from "../constants.js";


const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await userRepository.setRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating the access or refresh token"
        );
    }
};

// cookie options reused across login/logout
const cookieOptions = {
    httpOnly: true,
    secure: true,
};

//  REGISTER  (public — always creates a 'user')
const registerUser = asyncHandler(async (req, res) => {
    // Body already Joi-validated & sanitized by validate(registerSchema).
    const { fullName, email, password } = req.body;

    // 1) reject duplicate email
    const exists = await userRepository.existsByEmail(email);
    if (exists) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 2) files — avatar mandatory, coverImage optional (multer -> req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // 3) upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // 4) create the user (role defaults to 'user' in the repository)
    const createdUser = await userRepository.createUser({
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || null,
        role: ROLES.USER,
    });

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

//  LOGIN  (email + password)
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1) find the user (full row, includes password hash)
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // 2) verify password
    const valid = await isPasswordCorrect(password, user.password);
    if (!valid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // 3) tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

    // 4) clean copy without secrets to return
    const loggedInUser = await userRepository.findById(user.id);

    // 5) set cookies + respond. role is included so the frontend
    //    knows which dashboard (user/admin/superadmin) to route to.
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

//  LOGOUT  (requires verifyJWT -> req.user)
const logoutUser = asyncHandler(async (req, res) => {
    await userRepository.clearRefreshToken(req.user.id);

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
