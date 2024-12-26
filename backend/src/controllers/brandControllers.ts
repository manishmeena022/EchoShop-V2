import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import Brand from "../models/brandModel";

// Create Brand
const createBrand = asyncHandler(async (req: Request, res: Response) => {
    const { name, image, description, website, isFeatured } = req.body;

    // Create a new brand
    const brand = new Brand({
        name,
        image,
        description,
        website,
        isFeatured,
    });

    if (!brand) {
        return res.status(400).json({
            message: "Brand not created",
        });
    }

    // Save the brand to the database
    await brand.save();

    // Send the response
    res.status(201).json({
        message: "Brand created successfully",
        brand,
    });
});

// Get Brand
const getBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Find the brand by ID
    const brand = await Brand.findById(id);

    if (!brand) {
        return res.status(404).json({
            message: "Brand not found",
        });
    }

    // Send the response
    res.status(200).json(brand);
});

// Get all Brands
const getAllBrands = asyncHandler(async (req: Request, res: Response) => {
    // Fetch all brands from the database
    const brands = await Brand.find({}).sort({ createdAt: -1 });

    // Send the response
    res.status(200).json(brands);
});

// Delete Brand
const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
    const brandId = req.params.id;

    // Find the brand by ID
    const brand = await Brand.findByIdAndDelete(brandId);

    if (!brand) {
        return res.status(404).json({
            message: "Brand not found",
        });
    }

    // Send the response
    res.status(200).json({
        message: "Brand deleted successfully",
    });
});

// Update Brand
const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const brandId = req.params.id;
    const { name, image, description, website, isFeatured } = req.body;

    // Find the brand by ID
    const brand = await Brand.findByIdAndUpdate(brandId, {
        name,
        image,
        description,
        website,
        isFeatured,
    });

    if (!brand) {
        return res.status(404).json({
            message: "Brand not found",
        });
    }

    // Send the response
    res.status(200).json({
        message: "Brand updated successfully",
        brand,
    });
});

export { createBrand, getBrand, getAllBrands, deleteBrand, updateBrand };
