import axios from "axios";

const BASE_URL = '/api';
export const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000000,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        const data = response.data

        if (data.status === "success") {
            console.log("Success from response interceptor: ")
            return data;
        }
        console.warn("Error from response interceptor: ", data)
        return Promise.reject(data);
    },
    (error) => {
        console.error("Error from response interceptor: ", error)
        return Promise.reject({
            status: "error",
            message: "HTTP Error"
        });
    }
);

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user && user.token) {
            config.headers.Authorization = user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);