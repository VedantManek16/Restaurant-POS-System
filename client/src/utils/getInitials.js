export const getInitials = (name) => {
    if (!name) return "?\u003f"; // Unicode escape sequence to avoid IDE parser issues with "??"
    const cleanName = name.trim();
    if (cleanName.length <= 2) return cleanName.toUpperCase();

    const parts = cleanName.split(" ");
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
};
