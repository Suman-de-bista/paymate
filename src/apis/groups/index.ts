import toast from 'react-hot-toast';
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
        toast.success("Group created successfully");
        return response.data;
    } catch (error) {
        toast.error("Error creating group");
        console.error('Error creating group:', error);
        throw error;
    }
};

export const getGroupDetails = async (groupId: string) => {
    try {
        const response = await api.get(`/groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching group details:', error);
        throw error;
    }
};

export const updateGroupDetails = async (groupData: { id: string; name: string; description?: string }) => {
    try {
        const response = await api.post(`/groups/update`, groupData);
        toast.success("Group updated successfully");
        return response.data;
    } catch (error) {
        toast.error("Error updating group details");
        console.error('Error updating group details:', error);
        throw error;
    }
};

export const addGroupMembers = async (groupId: string, memberIds: string[]) => {
    try {
        const response = await api.post(`/groups/${groupId}/members`, { member_ids: memberIds });
        toast.success("Group members added successfully");
        return response.data;
    } catch (error) {
        toast.error("Error adding group members");
        console.error('Error adding group members:', error);
        throw error;
    }
};

export const searchUsersByEmailInGroup = async (email: string, groupId: string) => {
    try {
        const response = await api.get(`/users/search?email=${email}&group_id=${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};
