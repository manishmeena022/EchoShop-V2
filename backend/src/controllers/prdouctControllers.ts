import { Request, Response } from "express";
import Product from "../models/productModel";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

// Create Product
// Add a new product to the system.
const createProduct = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const {
            name,
            slug,
            price,
            salePrice,
            discount,
            quantity,
            description,
            images,
            category,
            brand,
        } = req.body;

        const product = new Product({
            name,
            slug,
            price,
            salePrice,
            discount,
            quantity,
            description,
            images,
            brand,
            category,
        });

        await product.save();
        res.status(201).json({
            message: "Product Created Successfult",
            product,
        });
    }
);

// Get Product by id
const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// Get All Products
const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
});

// Delete Product
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);
    if (product) {
        res.status(200).json({ message: "Product Deleted Successfully" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// Update Product
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const {
        name,
        slug,
        price,
        salePrice,
        discount,
        quantity,
        description,
        images,
        category,
        brand,
        isFeatured,
        isActive,
    } = req.body;

    const product = await Product.findById(productId);

    if (product) {
        product.name = name;
        product.price = price;
        product.salePrice = salePrice;
        product.discount = discount;
        product.quantity = quantity;
        product.description = description;
        product.images = images;
        product.brand = brand;
        product.category = category;
        product.slug = slug;
        product.isFeatured = isFeatured;
        product.isActive = isActive;

        await product.save();
        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

export {
    createProduct,
    getProductById,
    getAllProducts,
    deleteProduct,
    updateProduct,
};
