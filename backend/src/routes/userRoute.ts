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

// @ts-ignore
userRoute.post("/register", register);

// @ts-ignore
userRoute.post("/login", login);

// @ts-ignore
userRoute.get("/user", protect, roleGuard("admin"), getUser);

// @ts-ignore
userRoute.get("/getAllUsers", protect, roleGuard("admin"), getAllUsers);

// @ts-ignore
userRoute.put("/updateUser", protect, roleGuard("user"), updateUser);

userRoute.delete(
    "/deleteUser/:userId",
    protect,
    roleGuard("admin"),
    // @ts-ignore
    deleteUser
);

// // @ts-ignore
// userRoute.put("/changePassword", protect, roleGuard("user"), changePassword);

export default userRoute;
