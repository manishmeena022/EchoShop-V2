import { Router } from "express";
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrand,
    updateBrand,
} from "../controllers/brandControllers";

const brandRoute = Router();

brandRoute.post("/createBrand", createBrand);
brandRoute.get("/getBrand/:id", getBrand);
brandRoute.get("/getAllBrands", getAllBrands);
brandRoute.put("/updateBrand/:id", updateBrand);
brandRoute.delete("/deleteBrand/:id", deleteBrand);

export default brandRoute;
