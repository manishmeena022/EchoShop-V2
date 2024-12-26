import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { comparePassword, generateToken } from "../services/authService";
import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler";

const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret) {
    throw new Error('Env variable "jwtSecret" is required');
}

interface AuthenticatedRequest extends Request {
    user: IUser;
}

//////////////////////////////////////////////////////////////////////////////
// Core User Controllers

// Create User
// Register a new user.
const register = asyncHandler(async (req: Request, res: Response) => {
    const {
        name: { firstName, lastName },
        email,
        password,
    } = req.body;
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

// Get User By Id
// Retrieve user details by their unique ID.
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

// Get all Users
// Retrieve a list of all users.
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
// Update user details, including profile, email, and address.
const updateUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { username, email, password } = req.body;
        try {
            const user = await User.findByIdAndUpdate(req.user?._id, {
                username,
                email,
                password,
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
        } catch (err: unknown) {
            console.error("Error", err);
            res.status(500).send({
                error:
                    err instanceof Error ? err.message : "Something went wrong",
            });
        }
    }
);

// Delete User (Soft delete)
// Mark a user as deleted by setting deletedAt and deactivating the account.
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        console.log("userId", userId);

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(401).json({
                message: "User does not exist",
            });
            return;
        }

        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
});

// Restore User
// Reactivate a previously deleted user by clearing the deletedAt field and setting isActive to true.
const restoreUser = asyncHandler(async (req: Request, res: Response) => {
    try {
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
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
});

// Permanently Delete User
// Completely remove the user from the database
const permanentlyDeleteUser = asyncHandler(
    async (req: Request, res: Response) => {
        try {
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
        } catch (err: unknown) {
            console.error("Error", err);
            res.status(500).send({
                error:
                    err instanceof Error ? err.message : "Something went wrong",
            });
        }
    }
);

//////////////////////////////////////////////////////////////////////////////
// Authentication and Authorization Controllers

// Login User
// Authenticate user credentials, generate, and return a JWT or session token.
const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({
            error: "Please enter a valid email & password",
        });
        return;
    }

    try {
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
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
});

// Logout User
// Handle token/session invalidation.
const logout = asyncHandler(async (req: Request, res: Response) => {});

// Change Password
// Allow users to update their password after validation.
const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

// Reset Password
// Send a reset link or OTP for password recovery.
const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

// Update Role (Admin)
// Allow admins to change the role of a user.
const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

//////////////////////////////////////////////////////////////////////////////
// Profile and Preferences

// Update Profile
// Update profile details such as age, phone, photo, and address.
const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (err: unknown) {
        console.error("Error", err);
        res.status(500).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

// Get wishlist
// Retrieve the user’s wishlist.
const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
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
    } catch (err) {
        console.log(err);
    }
};

// Add Product to Wishlist
// Add a product to the user's wishlist.
const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.body;
    try {
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
    } catch (err) {
        console.log(err);
    }
};

//const remove from wishlist
// Remove a product from the user's wishlist.
const removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;
    try {
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
    } catch (err) {
        console.log(err);
    }
};

//////////////////////////////////////////////////////////////////////////////////
// Cart Management

// Get Cart
// Retrieve items in the user’s cart.
const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?._id).populate(
            "cart.productId"
        );

        if (!user) {
            res.status(404).json({
                message: "User does not exist",
            });
            return;
        }

        res.status(200).json({
            cart: user.cart,
        });
    } catch (err) {
        console.log(err);
    }
};

// Save Cart
// Add a product to the cart or increase its quantity.
const saveCart = async (req: AuthenticatedRequest, res: Response) => {
    const { cart } = req.body;
    try {
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
    } catch (err) {
        console.log(err);
    }
};

// Update Cart
// Update the quantity of a product in the cart.
const updateCart = async (req: AuthenticatedRequest, res: Response) => {
    const { cartItems } = req.body;
    try {
    } catch (error) {
        console.log(error);
    }
};

// remove from Cart
// Remove a product from the cart.
const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
    } catch (error) {
        console.log(error);
    }
};

// Clear Cart
//  Empty the entire cart.
const clearCart = async (req: AuthenticatedRequest, res: Response) => {
    const { cartItems } = req.body;
    try {
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
    } catch (err) {
        console.log(err);
    }
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
// Allow the user to deactivate their own account (set isActive to false).

// Reactivate Account
// Allow the user to reactivate their account.

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
};
