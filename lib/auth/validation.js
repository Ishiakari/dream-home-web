const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\-\s]{7,20}$/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;

export const AUTH_MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(email = "") {
	return String(email).trim().toLowerCase();
}

export function normalizePhone(phone = "") {
	return String(phone).replace(/\s+/g, " ").trim();
}

export function normalizeClientRole(role) {
	const value = String(role || "").trim().toLowerCase();

	if (value === "owner") {
		return "Owner";
	}

	return "Renter";
}

export function validatePassword(password = "") {
	const value = String(password);
	const issues = [];

	if (value.length < AUTH_MIN_PASSWORD_LENGTH) {
		issues.push(`Password must be at least ${AUTH_MIN_PASSWORD_LENGTH} characters.`);
	}

	if (!UPPERCASE_REGEX.test(value)) {
		issues.push("Password must include at least one uppercase letter.");
	}

	if (!LOWERCASE_REGEX.test(value)) {
		issues.push("Password must include at least one lowercase letter.");
	}

	if (!NUMBER_REGEX.test(value)) {
		issues.push("Password must include at least one number.");
	}

	return {
		isValid: issues.length === 0,
		issues,
	};
}

export function validateLoginInput(values = {}) {
	const errors = {};
	const email = normalizeEmail(values.email);
	const password = String(values.password || "");

	if (!email) {
		errors.email = "Email is required.";
	} else if (!EMAIL_REGEX.test(email)) {
		errors.email = "Please enter a valid email address.";
	}

	if (!password) {
		errors.password = "Password is required.";
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
		data: {
			email,
			password,
		},
	};
}

export function validateSignupInput(values = {}) {
	const errors = {};

	const firstName = String(values.firstName || "").trim();
	const lastName = String(values.lastName || "").trim();
	const email = normalizeEmail(values.email);
	const telephoneNo = normalizePhone(values.telephoneNo || values.phone || "");
	const address = String(values.address || "").trim() || "Unknown Address";
	const role = normalizeClientRole(values.role);
	const password = String(values.password || "");
	const confirmPassword = String(values.confirmPassword || "");

	if (!firstName) {
		errors.firstName = "First name is required.";
	}

	if (!lastName) {
		errors.lastName = "Last name is required.";
	}

	if (!email) {
		errors.email = "Email is required.";
	} else if (!EMAIL_REGEX.test(email)) {
		errors.email = "Please enter a valid email address.";
	}

	if (!telephoneNo) {
		errors.telephoneNo = "Phone number is required.";
	} else if (!PHONE_REGEX.test(telephoneNo)) {
		errors.telephoneNo = "Please enter a valid phone number.";
	}

	const passwordValidation = validatePassword(password);
	if (!passwordValidation.isValid) {
		errors.password = passwordValidation.issues[0];
	}

	if (!confirmPassword) {
		errors.confirmPassword = "Please confirm your password.";
	} else if (confirmPassword !== password) {
		errors.confirmPassword = "Passwords do not match.";
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
		data: {
			first_name: firstName,
			last_name: lastName,
			email,
			telephone_no: telephoneNo,
			address,
			role,
			password,
		},
	};
}

export function validateForgotPasswordInput(values = {}) {
	const errors = {};
	const email = normalizeEmail(values.email);

	if (!email) {
		errors.email = "Email is required.";
	} else if (!EMAIL_REGEX.test(email)) {
		errors.email = "Please enter a valid email address.";
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
		data: {
			email,
		},
	};
}

