import { Mail, MapPin, Phone, UserCircle, Edit3 } from "lucide-react";
import { getRoleTagTone, getUserRoleLabel } from "@/lib/auth/roles";

function getInitials(name = "") {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "DH";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// 🌟 Added 'onEditClick' to the props
export default function ProfileSummaryCard({ user, onEditClick }) {
  const displayName = user?.fullName || user?.firstName || "DreamHome User";
  const roleLabel = getUserRoleLabel(user?.role);
  const roleTone = getRoleTagTone(user?.role);

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003580] text-lg font-extrabold text-white">
            {getInitials(displayName)}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#003580] sm:text-3xl">
              {displayName}
            </h1>
            <p className="mt-1 text-sm text-gray-600">Welcome to your DreamHome profile.</p>
          </div>
        </div>

        {/* 🌟 ACTION SECTION: Role Tag + Edit Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onEditClick}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-bold text-[#003580] transition hover:bg-blue-100 active:scale-95"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </button>

          <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${roleTone}`}>
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-blue-50/40 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <Mail className="h-3.5 w-3.5" />
            Email
          </p>
          <p className="text-sm font-medium text-gray-800">{user?.email || "Not available"}</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-blue-50/40 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <Phone className="h-3.5 w-3.5" />
            Phone
          </p>
          <p className="text-sm font-medium text-gray-800">{user?.telephoneNo || "Not available"}</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-blue-50/40 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            Address
          </p>
          <p className="text-sm font-medium text-gray-800">{user?.address || "Not available"}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
        <p className="flex items-start gap-2">
          <UserCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Your account dashboard adapts based on your role so you only see the tools relevant to you.
          </span>
        </p>
      </div>
    </section>
  );
}