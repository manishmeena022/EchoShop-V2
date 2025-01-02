"use client";

import Image from "next/image";

interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
}: IProduct) {
    return (
        <div
            key={id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            <img src={image} alt={name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-700">{name}</h2>
                <p className="text-sm text-gray-500 mt-2">{description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">
                        ${price}
                    </span>
                    <button className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
