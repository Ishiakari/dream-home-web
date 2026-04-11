'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, X } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import { RoleSelector } from "@/components/ui/RoleSelector";
import { useAuth } from "@/hooks/useAuth";

const INITIAL_FORM = {
	firstName: "",
	lastName: "",
	email: "",
	telephoneNo: "",
	address: "",
	role: "renter",
	password: "",
	confirmPassword: "",
};

export default function SignUpModal({
	isOpen = false,
	onClose,
	onSwitchToLogin,
	redirectTo = "/profile",
}) {
	const router = useRouter();
	const { signup, isLoading, error, clearError } = useAuth();

	const [form, setForm] = useState(INITIAL_FORM);
	const [formErrors, setFormErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setForm(INITIAL_FORM);
			setFormErrors({});
			setShowPassword(false);
			setShowConfirmPassword(false);
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
		setFormErrors({});

		const result = await signup(form);

		if (!result.success) {
			setFormErrors(result.errors || {});
			return;
		}

		onClose?.();
		router.push(redirectTo);
		router.refresh();
	};

	return (
		<div className="fixed inset-0 z-90 flex items-center justify-center px-4 py-8">
			<button
				type="button"
				onClick={() => onClose?.()}
				className="absolute inset-0 bg-black/50"
				aria-label="Close signup modal"
			/>

			<div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
				<button
					type="button"
					onClick={() => onClose?.()}
					className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
					aria-label="Close"
				>
					<X className="h-5 w-5" />
				</button>

				<div className="mb-6">
					<h2 className="text-2xl font-bold text-[#003580]">Create your account</h2>
					<p className="mt-1 text-sm text-gray-600">Join DreamHome as a renter or property owner.</p>
				</div>

				{error ? (
					<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{error}
					</div>
				) : null}

				<form onSubmit={handleSubmit} className="space-y-4">
					<RoleSelector
						activeRole={form.role}
						setActiveRole={(nextRole) =>
							setForm((prev) => ({
								...prev,
								role: nextRole,
							}))
						}
					/>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<FormInput
								label="First name"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								autoComplete="given-name"
							/>
							{formErrors.firstName ? (
								<p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
							) : null}
						</div>

						<div>
							<FormInput
								label="Last name"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								autoComplete="family-name"
							/>
							{formErrors.lastName ? (
								<p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
							) : null}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<FormInput
								label="Email"
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								autoComplete="email"
							/>
							{formErrors.email ? (
								<p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
							) : null}
						</div>

						<div>
							<FormInput
								label="Phone number"
								type="tel"
								name="telephoneNo"
								value={form.telephoneNo}
								onChange={handleChange}
								autoComplete="tel"
							/>
							{formErrors.telephoneNo ? (
								<p className="mt-1 text-xs text-red-600">{formErrors.telephoneNo}</p>
							) : null}
						</div>
					</div>

					<div>
						<FormInput
							label="Address"
							name="address"
							value={form.address}
							onChange={handleChange}
							autoComplete="street-address"
						/>
						{formErrors.address ? (
							<p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
						) : null}
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={form.password}
									onChange={handleChange}
									autoComplete="new-password"
									required
									className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-11 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
									placeholder="Create a password"
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
							{formErrors.password ? (
								<p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
							) : (
								<p className="mt-1 text-xs text-gray-500">Use 8+ characters with uppercase and number.</p>
							)}
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Confirm password</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									value={form.confirmPassword}
									onChange={handleChange}
									autoComplete="new-password"
									required
									className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-11 outline-none transition focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20"
									placeholder="Confirm password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((prev) => !prev)}
									className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500"
									aria-label={showConfirmPassword ? "Hide password" : "Show password"}
								>
									{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
							{formErrors.confirmPassword ? (
								<p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>
							) : null}
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#003580] px-4 py-2.5 font-semibold text-white transition hover:bg-[#002a66] disabled:cursor-not-allowed disabled:opacity-70"
					>
						<UserPlus className="h-4 w-4" />
						{isLoading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<p className="mt-5 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<button
						type="button"
						onClick={() => onSwitchToLogin?.()}
						className="font-semibold text-[#E11553] hover:underline"
					>
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
}

export { SignUpModal as SignupDialog };

