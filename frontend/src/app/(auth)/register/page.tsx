import RegisterForm from "@/components/auth/RegisterForm";
export default function RegisterPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 bg-white shadow-lg sm:rounded-lg">
            <h1 className="font-bold mb-10 text-2xl">Register</h1>
            <RegisterForm />
        </div>
    );
}
