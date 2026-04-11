'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import SignUpModal from "@/components/auth/SignUpModal";
import { useAuth } from "@/hooks/useAuth";
import { normalizeEmail } from "@/lib/auth/validation";

const INITIAL_FORM = {
	email: "",
	password: "",
};

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

	const [form, setForm] = useState(INITIAL_FORM);
	const [formError, setFormError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSignupOpen, setIsSignupOpen] = useState(false);

	const nextPath = searchParams.get("next") || "/profile";

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push(nextPath);
			router.refresh();
		}
	}, [isAuthenticated, isLoading, nextPath, router]);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearError();
		setFormError("");

		const result = await login({
			email: normalizeEmail(form.email),
			password: form.password,
		});

		if (!result.success) {
			setFormError(result.error || "Unable to sign in. Please try again.");
			return;
		}

		router.push(nextPath);
		router.refresh();
	};

	const currentError = formError || error;

	return (
		<>
			<section className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-linear-to-b from-[#f4f8ff] to-white px-4 py-10">
				<div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
					<div className="mb-6 text-center">
						<h1 className="text-3xl font-extrabold text-[#003580]">Sign in</h1>
						<p className="mt-2 text-sm text-gray-600">Access your DreamHome dashboard securely.</p>
					</div>

					{currentError ? (
						<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{currentError}
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
								className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
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
									className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-11 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
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

						<div className="text-right">
							<Link href="/forgot-password" className="text-sm font-medium text-[#003580] hover:underline">
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

					<p className="mt-6 text-center text-sm text-gray-600">
						New to DreamHome?{" "}
						<button
							type="button"
							onClick={() => setIsSignupOpen(true)}
							className="font-semibold text-[#E11553] hover:underline"
						>
							Create account
						</button>
					</p>
				</div>
			</section>

			<SignUpModal
				isOpen={isSignupOpen}
				onClose={() => setIsSignupOpen(false)}
				onSwitchToLogin={() => setIsSignupOpen(false)}
				redirectTo={nextPath}
			/>
		</>
	);
}

