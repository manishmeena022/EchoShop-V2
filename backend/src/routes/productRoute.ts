import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controllers/prdouctControllers";

const productRoute = Router();

productRoute.post("/createProduct", createProduct);
productRoute.get("/getProductById/:id", getProductById);
productRoute.get("/getAllProducts", getAllProducts);
productRoute.put("/updateProduct/:id", updateProduct);
productRoute.delete("/deleteProduct/:id", deleteProduct);

export default productRoute;
