import { Router } from "express";
import {
    changePassword,
    deleteUser,
    getAllUsers,
    getUser,
    signIn,
    signUp,
    updateUser
} from "../controllers/userController";
import {protect, roleGuard} from "../middlewares/authMiddleware";

const userRoute = Router();

// @ts-ignore
userRoute.post("/signup", signUp)
// @ts-ignore
userRoute.post("/login", signIn)

// @ts-ignore
userRoute.get("/user", protect, roleGuard("user"), getUser)

// @ts-ignore
userRoute.get("/getAllUsers", protect, roleGuard("admin"), getAllUsers);

// @ts-ignore
userRoute.put("/updateUser", protect, roleGuard("user"), updateUser)

// @ts-ignore
userRoute.delete("/deleteUser", protect, roleGuard("admin"), deleteUser);

// @ts-ignore
userRoute.put("/changePassword", protect, roleGuard("user"), changePassword);

export default userRoute;