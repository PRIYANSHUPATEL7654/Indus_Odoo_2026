
export const generateLabelFromPath = (path?: string): string => {
    if (!path) return "";

    const key = path.split(".").pop() ?? "";

    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatEntityName = (entity?: string) => {
    if (!entity) return "";

    return entity
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const generatePlaceholderFromPath = (path?: string, format: string = "text"): string => {
    if (!path) return "";

    const key = path.split(".").pop() ?? "";

    const titleCase = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    if (format === "select") {
        return `Select ${titleCase}`;
    }

    return `Enter ${titleCase}`;
};
