import { getApiBase } from "@/helpers/apiBase";
import axios, { AxiosInstance } from "axios";
import { useUserStore } from "@/store/userStore";
import { getTokenCookie } from "@/helpers/tokenCookie";

const getAxiosInstance = (version: string = "v1"): AxiosInstance => {

    const instance = axios.create({
        baseURL: getApiBase(version),
        withCredentials: true,
        timeout: 5000,
    });

    instance.interceptors.request.use(async (config) => {
        let token = useUserStore.getState().user?.token;

        if (!token && typeof window !== "undefined") {
            // @ts-ignore
            token = getTokenCookie();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => {
            return response?.data;
        },

        async (error) => {
            const statusCode: number = error?.response?.status || 500;

            if (statusCode === 401) {
                useUserStore.getState().logout();

                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;

                    if (!currentPath.startsWith("/login")) {
                        const params = new URLSearchParams({
                            destination: currentPath,
                            notify: "Session Expired, Please Login again"
                        });
                        window.location.href = `/login?${params.toString()}`;
                    }
                }

                return Promise.reject(error);
            }

            return Promise.reject(error?.response?.data || { message: "Something went wrong" });
        }
    );

    return instance;
};

export default getAxiosInstance;
