import toast from 'react-hot-toast';
import { Transaction } from '../../types/group';
import api from '../api';




export const getTransactions = async (groupId: string) => {
    try {
        const response = await api.get(`/transaction/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const createTransaction = async (transactionData: Transaction) => {
    try {
        const response = await api.post('/transaction/add', transactionData);
        toast.success("Transaction created successfully");
        return response.data;
    } catch (error) {
        toast.error("Error creating transaction");
        console.error('Error creating transaction:', error);
        throw error;
    }
};