import { Request, Response } from "express";
import Product from "../models/productModel";

// Create Producct
// Add a new product to the system.
const createProduct = async (req: Request, res: Response) => {
    const { name, price, description, image, brand, category, countInStock } =
        req.body;

    try {
        const product = new Product({
            name,
            price,
            //   user: req.user?._id,
            image,
            brand,
            category,
            countInStock,
            numReviews: 0,
            description,
        });

        await product.save();
        res.status(201).json({
            message: "Product Created Successfult",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Product by id
const getProductById = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Products
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Product
const deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByIdAndDelete(productId);
        if (product) {
            res.status(200).json({ message: "Product Deleted Successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Product
const updateProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const { name, price, description, image, brand, category, countInStock } =
        req.body;

    try {
        const product = await Product.findById(productId);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            // product.countInStock = countInStock;

            await product.save();
            res.status(200).json({
                message: "Product updated successfully",
                product,
            });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export {
    createProduct,
    getProductById,
    getAllProducts,
    deleteProduct,
    updateProduct,
};
