// ENVIRONMENT VARIABLES: Never hardcode your API URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const registerClient = async (formData, role) => {
  const djangoPayload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    telephone_no: formData.phone,   
    gender: formData.gender,
    birthdate: formData.birthdate,
    password: formData.password,
    role: role.toUpperCase()         
  };

  try {
    const response = await fetch(`${API_BASE_URL}/users/clients/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(djangoPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (process.env.NODE_ENV === "development") {
        console.error("Django Error:", errorData);
      }

      const errorMessage = errorData?.email 
        ? "That email is already registered." 
        : "Failed to create account. Please check your details.";
        
      throw new Error(errorMessage);
    }

    return await response.json();

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error("Network or parsing error:", error);
    }
    throw new Error(error.message || "A network error occurred. Please try again later.");
  }
};


export const loginClient = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },

      body: JSON.stringify({
        username: email, 
        password: password,
      }),
    });

    if (!response.ok) {

      throw new Error("Invalid email or password. Please try again.");
    }

    const tokens = await response.json();
    
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);

    return tokens;

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Login Error:", error);
    }
    throw new Error(error.message || "Failed to connect to the server.");
  }
};


export const logoutClient = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};