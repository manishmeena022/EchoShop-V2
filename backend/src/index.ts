import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import brandRoute from "./routes/brandRoute";
import categoryRoute from "./routes/categoryRoute";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/categories", categoryRoute);

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log("Listening on PORT", PORT);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();
