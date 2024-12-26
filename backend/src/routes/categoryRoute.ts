import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
} from "../controllers/categoryControllers";

const categoryRoute = Router();

categoryRoute.post("/createCategory", createCategory);
categoryRoute.get("/getCategory/:id", getCategoryById);
categoryRoute.get("/getAllCategories", getAllCategories);
categoryRoute.put("/updateCategory/:id", updateCategory);
categoryRoute.delete("/deleteCategory/:id", deleteCategory);

export default categoryRoute;
