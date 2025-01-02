import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { LuBaggageClaim } from "react-icons/lu";

const Links = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "Products",
        link: "/products",
    },
    {
        name: "Features",
        link: "/features",
    },
    {
        name: "Sale",
        link: "/sale",
    },
];

export default function Header() {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">
                <Link href="/">Echo Shop</Link>
            </h1>
            <nav>
                <ul className="flex justify-between space-x-4">
                    {Links.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.link}
                                className="hover:text-gray-300"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="flex items-center space-x-4">
                <Link href="/profile">
                    <CgProfile size={24} />
                </Link>
                <Link href="/cart">
                    <LuBaggageClaim size={24} />
                </Link>
            </div>
        </header>
    );
}
