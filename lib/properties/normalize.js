// Central place to normalize backend property payloads (snake_case) into a consistent frontend shape.

export function normalizeProperty(raw = {}) {
    const propertyNo = raw.property_no ?? raw.propertyNo ?? raw.id ?? "";
    const monthlyRent = raw.monthly_rent ?? raw.monthlyRent ?? null;
    const noOfRooms = raw.no_of_rooms ?? raw.noOfRooms ?? null;

    return {
        // IDs
        propertyNo,
        id: propertyNo, // alias so older components still work

        // Basic info
        title: raw.title ?? "",
        description: raw.description ?? "",
        propertyType: raw.property_type ?? raw.propertyType ?? raw.type ?? "",
        status: raw.status ?? "Available",

        // Location
        street: raw.street ?? "",
        area: raw.area ?? "",
        city: raw.city ?? "",
        postcode: raw.postcode ?? "",

        // Pricing/rooms
        monthlyRent,
        noOfRooms,

        // Raw in case you need extra backend fields later
        _raw: raw,
    };
    }

    export function normalizePropertyList(data) {
    const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.results) ? data.results :
        Array.isArray(data?.items) ? data.items :
        [];

    return list.map(normalizeProperty);
}