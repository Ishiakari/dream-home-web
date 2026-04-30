import { apiClient } from "@/lib/apiClient";
import { normalizePropertyList } from "@/lib/properties/normalize";

// Fetch all properties for browsing (renter side)
export async function fetchProperties({ token, params } = {}) {
  // If you later support filters, you can pass params (e.g. { city: "London" })
  // For now, just fetch the list endpoint.
    const data = await apiClient.get("properties/", { token, params });
    return normalizePropertyList(data);
    }

    // Fetch current owner's properties (already used elsewhere as properties/my/)
    export async function fetchMyProperties({ token } = {}) {
    const data = await apiClient.get("properties/my/", { token });
    return normalizePropertyList(data);
}