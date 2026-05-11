import { formatMonthlyRentPHP } from '@/lib/formatMoney';

// Map backend property payload -> the shape PropertyDialog can safely consume.
// This prevents crashes because the backend doesn't provide all dialog fields yet.

export function toDialogProperty(p) {
    if (!p) return null;

    const propertyNo = p.property_no ?? p.propertyNo ?? p.id ?? "N/A";
    const title = p.title ?? "Untitled property";
    const street = p.street ?? "";
    const city = p.city ?? "";
    const area = p.area ?? "";
    const postcode = p.postcode ?? "";
    const propertyType = p.property_type ?? p.propertyType ?? "Property";
    const rooms = p.no_of_rooms ?? p.noOfRooms ?? 0;
    const monthlyRent = p.monthly_rent ?? p.monthlyRent ?? null;
    const status = p.status ?? "Available";
    const description = p.description ?? "";

    return {
        title,
        location: [city, postcode].filter(Boolean).join(", ") || city || "—",
        price:
        monthlyRent !== null && monthlyRent !== undefined
            ? formatMonthlyRentPHP(monthlyRent)
            : "—",
        tags: [status, propertyType].filter(Boolean),
        images: ["/PlaceHolderPic.png"],
        agent: {
        name: "DreamHome",
        title: "Property Team",
        avatarUrl: "https://i.pravatar.cc/150?img=11",
        },

        propertyType,
        yearBuilt: null,
        bathrooms: null,
        bedrooms: rooms || null,
        address: street || "—",
        zip: postcode || "—",
        city: city || "—",
        area: area || "—",
        description: description || "No description provided.",
        propertyId: propertyNo,
        status: status || "—",
        features: [],
    };
}