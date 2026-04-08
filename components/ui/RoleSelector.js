import { User, Home } from "lucide-react";

export const RoleSelector = ({ activeRole, setActiveRole }) => (
  <div className="flex p-1 mb-6 bg-gray-100 rounded-lg">
    <button
      type="button"
      onClick={() => setActiveRole("renter")}
      className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
        activeRole === "renter" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
      }`} 
    >
      <User className="w-4 h-4 mr-2" /> Renter
    </button>
    <button
      type="button"
      onClick={() => setActiveRole("owner")}
      className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
        activeRole === "owner" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <Home className="w-4 h-4 mr-2" /> Owner
    </button>
  </div>
);