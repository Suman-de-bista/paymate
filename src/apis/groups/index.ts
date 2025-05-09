import api from '../api';

export const getGroups = async () => {
    try {
        const response = await api.get('/groups/');
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};

export const createGroup = async (groupData: { name: string; description?: string }) => {
    try {
        const response = await api.post('/groups/create', groupData);
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};
