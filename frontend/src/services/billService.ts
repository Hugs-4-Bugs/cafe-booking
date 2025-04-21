import api from './api';

export interface IBill {
  id: number;
  uuid: string;
  name: string;
  email: string;
  contactNumber: string;
  paymentMethod: string;
  total: number;
  productDetails: string; // This is a JSON string
  createdBy: string;
}

export interface IBillRequest {
  name: string;
  email: string;
  contactNumber: string;
  paymentMethod: string;
  totalAmount: number;
  productDetails: string | any[]; // Can be a JSON string or array of objects
}

const billService = {
  generateReport: (data: IBillRequest) => {
    return api.post<string>('/bill/generateReport', data);
  },

  getBills: () => {
    return api.get<IBill[]>('/bill/getBills');
  },

  getPdf: (billId: number) => {
    return api.get<Blob>('/bill/getPdf', {
      params: { uuid: billId },
      responseType: 'blob'
    });
  },

  deleteBill: (billId: number) => {
    return api.post<string>(`/bill/delete/${billId}`);
  }
};

export default billService;
