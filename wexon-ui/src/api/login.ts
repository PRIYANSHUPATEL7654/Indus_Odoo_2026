import getAxiosInstance from "@/api/getAxiosInstance";

export const login = async (body: any) => {
    const instance = getAxiosInstance();
    return instance.post('/auth/login', body);
}