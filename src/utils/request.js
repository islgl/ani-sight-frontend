import axios from "axios";
import { ElMessage } from "element-plus";

const BASE_URL = '/api';
export const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        if (response.data.status === "success") {
            return response.data;
        }
        ElMessage.error(response.data.msg);
        return Promise.reject(response.data);
    },
    (error) => {
        console.log("Error: ", error)
        return Promise.reject(error);
    }
);

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
            config.headers.Authorization = user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);