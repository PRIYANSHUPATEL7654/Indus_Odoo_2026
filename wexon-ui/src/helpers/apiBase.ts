// const apiBaseURL = "https://api.wexon.in/api";
const apiBaseURL = "http://localhost:8083/api";

export const getApiBase = (version: string = "v1"): string => {
    return `${apiBaseURL}/${version}`;
};

// export const getApiBase = (version: string = "v1"): string => {
//     return `/api/${version}`;
// };