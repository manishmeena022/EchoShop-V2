import { Router } from "express";
import {
  register,
  login,
  getUser,
  getAllUsers,
  updateUser,
  // changePassword,
  // deleteUser,
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
userRoute.put("/updateUser", protect, roleGuard("admin"), updateUser);

// // @ts-ignore
// userRoute.delete("/deleteUser", protect, roleGuard("admin"), deleteUser);

// // @ts-ignore
// userRoute.put("/changePassword", protect, roleGuard("user"), changePassword);

export default userRoute;
