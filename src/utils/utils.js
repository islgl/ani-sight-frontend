import router from "@/router/index.js";

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sts');
    router.push('/login').then(r => r);
}