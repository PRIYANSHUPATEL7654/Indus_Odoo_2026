import getAxiosInstance from "@/api/getAxiosInstance";

export const getCurrentUser = async () => {
    const instance = getAxiosInstance();
    return instance.get('/user/getCurrentUser');
}