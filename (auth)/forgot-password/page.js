'use client';

import { useState } from "react";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
	const { requestPasswordReset, isLoading, error, clearError } = useAuth();

	const [email, setEmail] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [formError, setFormError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearError();
		setFormError("");
		setSuccessMessage("");

		const result = await requestPasswordReset({ email });

		if (!result.success) {
			setFormError(result.error || "Unable to process your request. Please try again.");
			return;
		}

		setSuccessMessage(result.message);
	};

	const currentError = formError || error;

	return (
		<section className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-linear-to-b from-[#f4f8ff] to-white px-4 py-10">
			<div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
				<div className="mb-6 text-center">
					<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#003580]/10 text-[#003580]">
						<Mail className="h-5 w-5" />
					</div>
					<h1 className="text-3xl font-extrabold text-[#003580]">Forgot password</h1>
					<p className="mt-2 text-sm text-gray-600">
						Enter your account email and we will send reset instructions.
					</p>
				</div>

				{currentError ? (
					<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{currentError}
					</div>
				) : null}

				{successMessage ? (
					<div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
						<p className="flex items-start gap-2">
							  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
							<span>{successMessage}</span>
						</p>
					</div>
				) : null}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							autoComplete="email"
							required
							className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
							placeholder="you@example.com"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-lg bg-[#003580] px-4 py-2.5 font-semibold text-white transition hover:bg-[#002a66] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isLoading ? "Submitting..." : "Send reset instructions"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-gray-600">
					Remembered your password?{" "}
					<Link href="/login" className="font-semibold text-[#E11553] hover:underline">
						Back to sign in
					</Link>
				</p>
			</div>
		</section>
	);
}

