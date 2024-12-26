import { Router } from "express";
import {
    register,
    login,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    // changePassword,
} from "../controllers/userController";
import { protect, roleGuard } from "../middlewares/authMiddleware";

const userRoute = Router();

userRoute.post("/register", register);

userRoute.post("/login", login);

userRoute.get("/user", protect, roleGuard("admin"), getUser);

userRoute.get("/getAllUsers", protect, roleGuard("admin"), getAllUsers);

userRoute.put("/updateUser", protect, roleGuard("user"), updateUser);

userRoute.delete(
    "/deleteUser/:userId",
    protect,
    roleGuard("admin"),
    deleteUser
);

// userRoute.put("/changePassword", protect, roleGuard("user"), changePassword);

export default userRoute;
