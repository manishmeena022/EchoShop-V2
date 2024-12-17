import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import asyncHandle from "./asyncHandler";

const jwtToken: string = process.env.USER_JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    [key: string]: any;
  };
}

const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, jwtToken) as { id: string };

    // Find the user by ID and exclude the password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request
    req.user = {
      id: user.id,
      ...user.toObject(),
    };

    // Proceed to the next middleware
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const roleGuard = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("req user", req.user);

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: No user data",
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};

const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Admin");
  }
};

// const adminOnly = roleGuard("admin")
// const userOnly = roleGuard("user")

export { protect, roleGuard, adminOnly };
