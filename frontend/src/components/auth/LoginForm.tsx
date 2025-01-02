"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface FormData {
    email: string;
    password: string;
}

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        console.log(data);

        const res = await axios.post(`${baseUrl}/users/login`, data);

        if (res.status === 200) {
            console.log("Login successful");
            console.log(res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            router.push("/");
        } else {
            console.log("An error occurred while logging in");
            alert("An error occurred while logging in");
        }
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Email"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            {...register("email", { required: true })}
                        />
                        {errors.email && (
                            <span className="text-red-500 font-medium text-sm">
                                Email is required
                            </span>
                        )}
                        <input
                            type="password"
                            placeholder="Password"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            {...register("password", { required: true })}
                        />
                        {errors.password && (
                            <span className="text-red-500 font-medium text-sm">
                                Password is required
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
