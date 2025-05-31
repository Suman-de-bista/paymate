import api from "../api";

export const getDashboardInfo = async (skip:number,limit:number) => {
    try {
        const response = await api.get(`/dashboard?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        throw error;
    }
};