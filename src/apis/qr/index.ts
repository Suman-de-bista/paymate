import api from '../api';

export interface QRDetail {
    id: string;
    user_id: string;
    name: string;
    description: string;
    qr_image: string;
    is_active: boolean;
    created_at: string;
}

export interface QRDetailCreate {
    name: string;
    description: string;
    qr_image: string; // Base64 encoded image
}

export const createQR = async (qrData: QRDetailCreate) => {
    try {
        const response = await api.post<QRDetail>('/qr/create', qrData);
        return response.data;
    } catch (error) {
        console.error('Error creating QR code:', error);
        throw error;
    }
};

export const getUserQRs = async () => {
    try {
        const response = await api.get<QRDetail[]>('/qr/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching QR codes:', error);
        throw error;
    }
}; 