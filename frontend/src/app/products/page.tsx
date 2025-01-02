import ProductCard from "@/components/common/ProductCard";

interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

export const products: IProduct[] = [
    {
        id: 1,
        name: "Product 1",
        price: 100,
        description: "Product 1 Description",
        image: "/images/product1.jpg",
    },
    {
        id: 2,
        name: "Product 2",
        price: 200,
        description: "Product 2 Description",
        image: "/images/product2.jpg",
    },
    {
        id: 3,
        name: "Product 3",
        price: 300,
        description: "Product 3 Description",
        image: "/images/product3.jpg",
    },
    {
        id: 4,
        name: "Product 4",
        price: 400,
        description: "Product 4 Description",
        image: "/images/product4.jpg",
    },
    {
        id: 5,
        name: "Product 5",
        price: 500,
        description: "Product 5 Description",
        image: "/images/product5.jpg",
    },
    {
        id: 6,
        name: "Product 6",
        price: 600,
        description: "Product 6 Description",
        image: "/images/product6.jpg",
    },
    {
        id: 7,
        name: "Product 7",
        price: 700,
        description: "Product 7 Description",
        image: "/images/product7.jpg",
    },
    {
        id: 8,
        name: "Product 8",
        price: 800,
        description: "Product 8 Description",
        image: "/images/product8.jpg",
    },
    {
        id: 9,
        name: "Product 9",
        price: 900,
        description: "Product 9 Description",
        image: "/images/product9.jpg",
    },
    {
        id: 10,
        name: "Product 10",
        price: 1000,
        description: "Product 10 Description",
        image: "/images/product10.jpg",
    },
];

export default function ProductPage() {
    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                Explore Our Products
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.image}
                    />
                ))}
            </div>
        </div>
    );
}
