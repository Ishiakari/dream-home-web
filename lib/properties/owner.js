// Helper to check if a property "owner" matches the current logged-in owner id/client_no.
// Handles different backend shapes (string, url-ish string, or object).
export function matchesOwner(ownerField, ownerId) {
    if (!ownerId) return true;

    if (typeof ownerField === "string") {
        const ownerStr = String(ownerField);
        const idStr = String(ownerId);
        return ownerStr === idStr || ownerStr.includes(idStr);
    }

    if (ownerField && typeof ownerField === "object") {
        return (
        String(ownerField.client_no || "") === String(ownerId) ||
        String(ownerField.clientNo || "") === String(ownerId) ||
        String(ownerField.id || "") === String(ownerId)
        );
    }

    return false;
}