import api from '../api';

export interface QRDetail {
    id: string;
    user_id: string;
    name: string;
    description: string;
    qr_image: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface QRDetailCreate {
    name: string;
    description: string;
    qr_image: File;
    is_active?: boolean;
}

export const createQR = async (qrData: QRDetailCreate) => {
    try {
        const formData = new FormData();
        formData.append('name', qrData.name);
        formData.append('description', qrData.description);
        formData.append('qr_image', qrData.qr_image);
        formData.append('is_active', qrData.is_active?.toString() ?? 'true');

        const response = await api.post<QRDetail>('/qr/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating QR code:', error);
        throw error;
    }
};

export const getUserQRs = async () => {
    try {
        const response = await api.get<QRDetail[]>('/qr');
        return response.data;
    } catch (error) {
        console.error('Error fetching QR codes:', error);
        throw error;
    }
};

export const deleteQR = async (qrId: string) => {
    try {
        const response = await api.delete(`/qr/${qrId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting QR code:', error);
        throw error;
    }
}; 