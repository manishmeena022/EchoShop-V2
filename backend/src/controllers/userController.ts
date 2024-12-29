import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { comparePassword, generateToken } from "../services/authService";
import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret) {
    throw new Error('Env variable "jwtSecret" is required');
}

//////////////////////////////////////////////////////////////////////////////
// Core User Controllers

// Register a new user.
const register = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, terms } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(409).json({
            message: "User already exists",
        });
    }

    const user = await User.create({
        name: {
            firstName,
            lastName,
        },
        email,
        password,
        terms,
    });

    if (user) {
        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: {
                    firstName: user.name.firstName,
                    lastName: user.name.lastName,
                },
                email: user.email,
                // role : user.role,
                isActive: user.isActive,
            },
        });
    } else {
        return res.status(400).json({
            message: "Invalid user data",
        });
    }
});

// Get User
const getUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = await User.findById(req.user?._id).select("-password");

        if (!user) {
            res.status(401).json({
                message: "User does not exist",
            });
            return;
        }

        res.status(200).json({
            message: "User found successfully",
            user,
        });
    }
);

// get User by ID
const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
        res.status(401).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        message: "User found successfully",
        user,
    });
});

// Get all Users
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find().select("-password");

    if (!users.length) {
        res.status(401).json({
            message: "No users found",
        });
        return;
    }

    res.status(200).json({
        users,
    });
});

// Update User
const updateUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { firstName, lastName, isActive } = req.body;
        const user = await User.findByIdAndUpdate(req.user?._id, {
            name: {
                firstName: firstName,
                lastName: lastName,
            },
            isActive: isActive,
        });

        if (!user) {
            res.status(401).json({
                message: "User does not exist",
            });
            return;
        }

        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    }
);

// Delete User (Soft delete)
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        isActive: false,
        deletedAt: Date.now(),
    });

    if (!user) {
        res.status(401).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        message: "User deleted successfully",
    });
});

// Restore User
const restoreUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        isActive: true,
        deletedAt: null,
    });

    if (!user) {
        res.status(401).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        message: "User restored successfully",
    });
});

// Permanently Delete User
const permanentlyDeleteUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(401).json({
                message: "User does not exist",
            });
            return;
        }

        res.status(200).json({
            message: "User deleted permanently",
        });
    }
);

//////////////////////////////////////////////////////////////////////////////
// Authentication and Authorization Controllers

// Login User
const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({
            error: "Please enter a valid email & password",
        });
        return;
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
        res.status(401).json({
            error: "Email does not exists",
        });
        return;
    }

    const isPasswordValid = await comparePassword(
        password,
        userExists.password
    );

    if (!isPasswordValid) {
        res.status(401).json({
            error: "Invalid email or password",
        });
        return;
    }

    res.status(200).json({
        message: "login successfully",
        token: generateToken(userExists._id as string),
        userInfo: {
            _id: userExists._id,
            fullName: userExists.fullName,
            email: userExists.email,
            role: userExists.role,
            isActive: userExists.isActive,
            whishlist: userExists.wishlist,
            cart: userExists.cart,
            orders: userExists.orders,
        },
    });
});

// Logout User
const logout = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
        message: "User logged out successfully",
    });
});

// Change Password
const changePassword = async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        return res.status(404).json({
            message: "User does not exist",
        });
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password",
        });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
        message: "Password updated successfully",
    });
};

// Reset Password
const resetPassword = async (req: Request, res: Response) => {
    try {
        //TODO: Implement password reset functionality
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

// Update Role (Admin)
const updateRole = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
        message: "User role updated successfully",
    });
};

//////////////////////////////////////////////////////////////////////////////
// Profile and Preferences

// Update Profile
const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    const { age, phone, photo, street, city, state, country, zip } = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id, {
        profile: {
            age,
            phone,
            photo,
            address: {
                street,
                city,
                state,
                country,
                zip,
            },
        },
    });

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    return res.status(200).json({
        message: "Profile updated successfully",
    });
};

// Get wishlist
const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?._id).populate("wishlist");

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        wishlist: user.wishlist,
    });
};

// Add Product to Wishlist
const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    if (user && user.wishlist && user.wishlist.includes(productId)) {
        return res.status(400).json({
            message: "Product already in wishlist",
        });
    }

    if (!user.wishlist) {
        user.wishlist = [];
    }

    user.wishlist.push(productId);
    await user.save();
};

//const remove from wishlist
const removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    const user = await User.findById(req.user?._id);
    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    if (
        user &&
        user.wishlist &&
        user.wishlist.includes(new mongoose.Types.ObjectId(productId))
    ) {
        user.wishlist = user.wishlist.filter(
            (id) => !id.equals(new mongoose.Types.ObjectId(productId))
        );
        await user.save();

        res.status(200).json({
            message: "Product removed from wishlist",
        });
    }

    res.status(400).json({
        message: "Product not in wishlist",
    });
};

//////////////////////////////////////////////////////////////////////////////////
// Cart Management

// Get Cart
const getCart = async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?._id).populate("cart.productId");

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        cart: user.cart,
    });
};

// Save Cart
const saveCart = async (req: AuthenticatedRequest, res: Response) => {
    const { cart } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    user.cart = cart;
    await user.save();
    res.status(200).json({
        message: "Cart saved successfully",
    });
};

// Update Cart
const updateCart = async (req: AuthenticatedRequest, res: Response) => {
    const { cartItems } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    user.cart = cartItems;
    await user.save();

    res.status(200).json({
        message: "Cart updated successfully",
        cartItems: user.cart,
    });
};

// remove from Cart
const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    if (!user.cart) {
        res.status(400).json({
            message: "Cart is empty",
        });
        return;
    }

    user.cart = user?.cart.filter(
        (item) => item.productId.toString() !== productId
    );
    await user.save();

    res.status(200).json({
        message: "Product removed from cart",
        cartItems: user.cart,
    });
};

// Clear Cart
const clearCart = async (req: AuthenticatedRequest, res: Response) => {
    const { cartItems } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    user.cart = [];
    await user.save();
    res.status(200).json({
        message: "Cart cleared successfully",
    });
};

//////////////////////////////////////////////////////////////////////////////////
// Order Management

// Place Orders
// Create a new order from the user's cart.

// Get Orders
// Retrieve all orders placed by the user.

// Get Order Details
// Retrieve details of a specific order by orderId.

// Cancel Order
// Allow the user to cancel an order, updating its status.

// Return Order
// Allow the user to return an order, updating its status.

//////////////////////////////////////////////////////////////////////////////////
// Account Management

// Deactivate Account
const deactivateAccount = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(userId, {
        isActive: false,
    });

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        message: "Account deactivated successfully",
    });
};

// Reactivate Account
const reactivateAccount = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(userId, {
        isActive: true,
    });

    if (!user) {
        res.status(404).json({
            message: "User does not exist",
        });
        return;
    }

    res.status(200).json({
        message: "Account reactivated successfully",
    });
};

export {
    register,
    login,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    changePassword,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    saveCart,
    getCart,
    clearCart,
    updateCart,
    removeFromCart,
    deactivateAccount,
    reactivateAccount,
    getUserById,
    restoreUser,
    permanentlyDeleteUser,
    updateRole,
    updateProfile,
    resetPassword,
};
