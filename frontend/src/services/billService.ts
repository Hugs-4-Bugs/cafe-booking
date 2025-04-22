import api from './api';

export interface IBillProduct {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export interface IBillRequest {
  name: string;
  email: string;
  contactNumber: string;
  paymentMethod: string;
  productDetails: string;
  total: number;
}

export interface IBill {
  id: number;
  uuid: string;
  name: string;
  email: string;
  contactNumber: string;
  paymentMethod: string;
  productDetails: string;
  total: number;
  createdBy: string;
  createdAt: string;
}

const billService = {
  generateReport: (data: IBillRequest) => {
    return api.post<{ uuid: string }>('/bill/generateReport', data);
  },

  getAllBills: () => {
    return api.get<IBill[]>('/bill/getBills');
  },

  downloadBill: (id: number) => {
    return api.post('/bill/getPdf', { id }, { responseType: 'blob' })
      .then((response) => {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bill-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  },

  deleteBill: (id: number) => {
    return api.post<string>('/bill/delete', { id });
  }
};

export default billService;
