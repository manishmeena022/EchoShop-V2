import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 bg-white shadow-lg sm:rounded-lg">
            <div className="flex flex-col items-center justify-center w-full mb-4">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-gray-500">Login to your account</p>
            </div>
            <LoginForm />
        </div>
    );
}
