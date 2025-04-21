import api from './api';

export interface IPayment {
  id: number;
  amount: number;
  timestamp: string;
  status: string;
  paymentType: string;
}

export interface IUPIPayment {
  upiId: string;
  amount: number;
  description?: string;
}

export interface ICardPayment {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  description?: string;
}

export interface IWalletPayment {
  walletType: string; // 'PAYTM', 'PHONEPE', 'MOBIKWIK'
  phoneNumber: string;
  amount: number;
  description?: string;
}

const paymentService = {
  processPayment: (paymentData: any) => {
    return api.post<IPayment>('/api/payment/process', paymentData);
  },

  verifyUpi: (upiId: string) => {
    return api.post<string>('/api/payment/upi/verify', upiId);
  },

  processUpiPayment: (paymentData: IUPIPayment) => {
    return api.post<string>('/api/payment/upi/pay', paymentData);
  },

  processQrUpiPayment: (paymentData: any) => {
    return api.post<string>('/api/payment/upi/qr-pay', paymentData);
  },

  processWalletPayment: (paymentData: IWalletPayment) => {
    return api.post<string>('/api/payment/wallet/pay', paymentData);
  },

  getAllPayments: () => {
    return api.get<IPayment[]>('/api/payment/all');
  },

  getPaymentById: (paymentId: number) => {
    return api.get<IPayment>(`/api/payment/${paymentId}`);
  },

  generateQrCode: (upiId: string, amount: number) => {
    return api.get<string>(`/api/payment/generate-qr/${upiId}/${amount}`);
  }
};

export default paymentService;
