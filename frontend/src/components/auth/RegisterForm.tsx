"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    terms: boolean;
}

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        console.log(data);

        if (!data.terms) {
            alert("You must agree to the terms and conditions");
            return;
        }

        const res = await axios.post(`${baseUrl}/users/register`, data);
        if (res.status === 201) {
            router.push("/login");
        } else {
            alert("An error occurred while registering");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            {...register("firstName", { required: true })}
                        />
                        {errors.firstName && (
                            <span className="text-red-500 font-medium text-sm">
                                Firstname is required
                            </span>
                        )}
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            {...register("lastName", { required: true })}
                        />
                        {errors.lastName && (
                            <span className="text-red-500 font-medium text-sm">
                                Lastname is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Email"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            {...register("email", { required: true })}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm font-medium">
                                Email is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            {...register("password", { required: true })}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm font-medium">
                                Password is required
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded-md"
                            {...register("terms", { required: true })}
                        />
                        <label className="text-gray-500">
                            I agree to the terms and conditions
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}
