import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const jwtToken: string = process.env.JWT_SECRET as string;
console.log("token ", jwtToken);

export interface DecodedToken {
    id: string;
}

export interface AuthenticatedRequest extends Request {
    user?: DecodedToken & Omit<IUser, "password">;
}

const protect = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtToken) as DecodedToken;

        // Find the user by ID and exclude the password field
        req.user = await User.findById(decoded?.id).select("-password");

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
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        return (async () => {
            if (!req.user || req.user.role !== requiredRole) {
                res.status(403).json({
                    message: "Access denied. Insufficient permissions.",
                });
                return;
            }
            next();
        })();
    };
};

export { protect, roleGuard };
