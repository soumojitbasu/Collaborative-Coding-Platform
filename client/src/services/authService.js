import api from "./api";

export async function register(formData) {
    const response = await api.post("/auth/register", formData);
    return response.data;
}

export async function verifyOTP(formData) {
    const response = await api.post("/auth/verify-otp", formData);
    return response.data;
}

export async function login(formData) {
    const response = await api.post("/auth/login", formData);
    return response.data;
}
export async function forgotPassword(formData){

    const response=await api.post(

        "/auth/forget-password",

        formData

    );

    return response.data;

}

export async function resetPassword(formData) {

    const response = await api.post(
        "/auth/reset-password",
        formData
    );

    return response.data;
}

export async function getCurrentUser() {
    return api.get("/auth/me");
}
export async function changePassword(formData) {

    const response = await api.post(

        "/auth/change-password",

        formData

    );

    return response.data;

}