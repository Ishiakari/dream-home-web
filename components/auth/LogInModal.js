'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { normalizeEmail } from "@/lib/auth/validation";

const INITIAL_FORM = {
    email: "",
    password: "",
};

export default function LogInModal({
    isOpen = false,
    onClose,
    onSwitchToSignup,
    redirectTo = "/profile",
}) {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuth();

    const [form, setForm] = useState(INITIAL_FORM);
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setForm(INITIAL_FORM);
            setFormError("");
            setShowPassword(false);
            clearError();
            return;
        }

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose, clearError]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const result = await login({
            email: normalizeEmail(form.email),
            password: form.password,
        });

        if (!result.success) {
            setFormError(result.error || "Invalid credentials. Please try again.");
            return;
        }

        onClose?.();
        router.push(redirectTo);
        router.refresh();
    };

    const errorMessage = formError || error;

    return (
        <div className="fixed inset-0 z-90 flex items-center justify-center px-4 py-8">
            <button
                type="button"
                onClick={() => onClose?.()}
                className="absolute inset-0 bg-black/50"
                aria-label="Close login modal"
            />

            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <button
                    type="button"
                    onClick={() => onClose?.()}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#003580]">Welcome back</h2>
                    <p className="mt-1 text-sm text-gray-600">Sign in to manage your DreamHome account.</p>
                </div>

                {errorMessage ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            // 👇 FIXED COLOR HERE
                            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                                // 👇 FIXED COLOR HERE
                                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 pr-11 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link href="/forgot-password" className="font-medium text-[#003580] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#003580] px-4 py-2.5 font-semibold text-white transition hover:bg-[#002a66] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <LogIn className="h-4 w-4" />
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600">
                    No account yet?{" "}
                    <button
                        type="button"
                        onClick={() => onSwitchToSignup?.()}
                        className="font-semibold text-[#E11553] hover:underline"
                    >
                        Create one
                    </button>
                </p>
            </div>
        </div>
    );
}

export { LogInModal as LoginDialog };