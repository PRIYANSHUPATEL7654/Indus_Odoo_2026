export const setTokenCookie = (token: string, hours: number = 24): void => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);

    const isProd = process.env.NODE_ENV === "production";

    document.cookie = [
        `token=${token}`,
        `expires=${date.toUTCString()}`,
        "path=/",
        isProd ? "Secure" : "",
        "SameSite=Lax" // use "None" ONLY if cross-domain
    ].filter(Boolean).join("; ");
};

export const getTokenCookie = (): string | null => {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
};

export const deleteTokenCookie = (): void => {
    const isProd = process.env.NODE_ENV === "production";

    document.cookie = [
        "token=",
        "path=/",
        "max-age=0",
        isProd ? "Secure" : "",
        "SameSite=Lax"
    ].filter(Boolean).join("; ");
};
