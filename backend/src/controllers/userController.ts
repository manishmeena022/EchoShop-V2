import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../services/authService";
import userZodSchema from "../validations/userValidation";
import { DecodedToken } from "../middlewares/authMiddleware";

const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret) {
  throw new Error('Env variable "jwtSecret" is required');
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken & Omit<IUser, "password">;
}

// Register User
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = userZodSchema.parse(req.body);

    const userExists = await User.findOne({ email: userData.email });

    if (userExists) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    userData.password = await hashPassword(userData.password);

    const user = await User.create(userData);

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err: unknown) {
    console.error("Error", err);
    res.status(500).send({
      error: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

// Login User
const login = async (req: Request, res: Response): Promise<void> => {
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
      userDetails: userExists,
    });
  } catch (err: unknown) {
    console.error("Error", err);
    res.status(500).send({
      error: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

// Logout User
const logout = async (req: Request, res: Response): Promise<void> => {};

// Get User Data
const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
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
  } catch (err: unknown) {
    console.error("Error", err);
    res.status(500).send({
      error: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (err: unknown) {
    console.error("Error", err);
    res.status(500).send({
      error: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

const updateUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userData = userZodSchema.parse(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, userData, {
      new: true,
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
      error: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

// const deleteUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findByIdAndDelete(userId);

//     if (!user) {
//       res.status(401).json({
//         message: "User does not exist",
//       });
//       return;
//     }
//     res.status(200).json({
//       message: "User deleted successfully",
//     });
//   } catch (err: unknown) {
//     console.error("Error", err);
//     res.status(500).send({
//       error: err instanceof Error ? err.message : "Something went wrong",
//     });
//   }
// };

// const changePassword = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.user?._id);

//     if (!user) {
//       res.status(404).json({
//         message: "User does not exist",
//       });
//       return;
//     }

//     const { oldPassword, newPassword } = req.body;

//     if (!oldPassword || !newPassword) {
//       return res.status(400).json({
//         message: "Please add old and new password",
//       });
//     }

//     if (oldPassword === newPassword) {
//       return res.status(400).json({
//         message: "New Password Should be different",
//       });
//     }

//     const passwordCheck = await bcrypt.compare(oldPassword, user.password);

//     if (!passwordCheck) {
//       res.status(401).json({
//         message: "Password is incorrect",
//       });
//       return;
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.status(200).json({
//       message: "Password Changed successfully",
//     });
//   } catch (err: unknown) {
//     console.error("Error", err);
//     res.status(500).send({
//       error: err instanceof Error ? err.message : "Something went wrong",
//     });
//   }
// };

export {
  register,
  login,
  getUser,
  getAllUsers,
  updateUser,
  // deleteUser,
  // changePassword,
};
