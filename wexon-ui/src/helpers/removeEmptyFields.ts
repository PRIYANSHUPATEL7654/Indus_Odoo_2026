export function removeEmptyFields<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) =>
            v !== "" && v !== null && v !== undefined
        )
    ) as Partial<T>;
}
