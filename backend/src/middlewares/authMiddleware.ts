import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const jwtToken: string = process.env.JWT_SECRET as string;
console.log("token ", jwtToken);

export interface DecodedToken {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken & Omit<IUser, "password">;
}

const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the token from Authorization header
  const authHeader = req.headers.authorization;

  console.log("auth Header", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  console.log("Token", token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtToken) as DecodedToken;

    console.log("DECODED : ", decoded);

    // Find the user by ID and exclude the password field
    req.user = await User.findById(decoded?.id).select("-password");

    console.log("req user", req.user);

    // Proceed to the next middleware
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Role guard for RBAC (Role-based Access Control)
const roleGuard = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

export { protect, roleGuard };
