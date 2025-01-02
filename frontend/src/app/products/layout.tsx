export default function ProductsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex items-center justify-center">
            <div className="container px-24 mx-auto flex items-center justify-center space-x-8 border border-black rounded-lg bg-gray-200">
                <div className="">{children}</div>
            </div>
        </div>
    );
}
