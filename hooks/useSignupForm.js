import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerClient, loginClient } from "../lib/authService"; 

export const useSignupForm = (activeRole) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    gender: "", birthdate: "", password: "", address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const resetForm = () => {
    setError("");
    setSuccess(false);
    setFormData({
      firstName: "", lastName: "", email: "", phone: "",
      gender: "", birthdate: "", password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await registerClient(formData, activeRole);
      setSuccess(true);
      
      await loginClient(formData.email, formData.password);

      setTimeout(() => {
        const role = activeRole.toLowerCase();
        router.push(role === "renter" ? "/dashboard/renter" : "/dashboard/owner");
      }, 1500);

    } catch (err) {
      setError(err.message || "An error occurred during signup.");
      setIsLoading(false); 
    }
  };

  return {
    formData, isLoading, error, success, handleChange, handleSubmit, resetForm
  };
};