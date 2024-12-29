import Image from "next/image";

import loginImg from "/public/login.svg";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex items-center justify-center h-screen ">
            <div className="container px-24 mx-auto flex items-center justify-center space-x-8 border border-black rounded-lg bg-gray-200">
                <div className="w-1/2">
                    <Image src={loginImg} alt="Login" />
                </div>
                <div className="w-1/2">{children}</div>
            </div>
        </div>
    );
}
