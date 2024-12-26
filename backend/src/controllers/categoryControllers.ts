import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import Category from "../models/categoryModel";

// create Category
const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, description, image } = req.body;

    // Create a new category
    const category = new Category({
        name,
        slug,
        description,
        image,
    });

    if (!category) {
        return res.status(400).json({
            message: "Category not created",
        });
    }

    // Save the category to the database
    await category.save();

    // Send the response
    res.status(201).json({
        message: "Category created successfully",
        category,
    });
});

// get Category by id
const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findById(categoryId);

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    // Send the response
    res.status(200).json(category);
});

// Get all Categories
const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    // Fetch all categories from the database
    const categories = await Category.find({}).sort({ createdAt: -1 });

    // Send the response
    res.status(200).json(categories);
});

// Delete Category
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    // Send the response
    res.status(200).json({
        message: "Category Deleted Successfully",
    });
});

// Update Category
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const { name, slug, description, image } = req.body;

    // Find the category by ID and update it
    const category = await Category.findByIdAndUpdate(categoryId, {
        name,
        slug,
        description,
        image,
    });

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    // Send the response
    res.status(200).json({
        message: "Category updated successfully",
        category,
    });
});

export {
    createCategory,
    getCategoryById,
    getAllCategories,
    deleteCategory,
    updateCategory,
};
