import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, QrCodeIcon, DevicePhoneMobileIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { billService, paymentService } from '../../services';

// Types from Cart component
interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  contactNumber: string;
  paymentMethod: string;
}

interface OrderData {
  customerInfo: CustomerInfo;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Card Payment Form
const CardPaymentForm = ({ onSubmit, isProcessing }: {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(cardData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          placeholder="XXXX XXXX XXXX XXXX"
          value={cardData.cardNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">Card Holder Name</label>
        <input
          type="text"
          id="cardHolderName"
          name="cardHolderName"
          placeholder="John Doe"
          value={cardData.cardHolderName}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/YY"
            value={cardData.expiryDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            placeholder="XXX"
            value={cardData.cvv}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${
          isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// UPI Payment Form
const UpiPaymentForm = ({ onSubmit, isProcessing, totalAmount }: {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  totalAmount: number;
}) => {
  const [upiId, setUpiId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [usingQr, setUsingQr] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ upiId });
  };

  const generateQrCode = async () => {
    try {
      // This is a placeholder - in a real app we'd call the backend to generate a QR code
      // const response = await paymentService.generateQrCode(upiId, totalAmount);
      // setQrCode(response.data);
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOOSURBVO3BQY4cSRIEQdNA/f/Luh0/zYKaRNzMdYId/sDMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwU354KeWvJNxIeSOlkvAk4Y2UNxJuUt5I+CsJLxxmymGmHGbKDx9L+CSJmyafSLhJuEn4JOGTJj5J+KTDTDnMlMNM+eGXJbyR8ETCE003CU9Suki4aXqS8EbCb3qYKYeZcpgpP/w/I6FKuEm4SbhpukmomvxfdJgph5lymCk//LKUXzSlvJFwk3CT8ETCTcpvepgph5lymCk/fCzlNzVVCTdNNwmfpPyLDjPlMFMOM+WHl1L+S5qeBNyk3CRUTVXCk5QnCU9SblKqhP+Sw0w5zJTDTPnhpYQnTTcJTxJuJNwkVAlPmm4kmP9/h5lymCmHmfLDL0t4I+GThCrhJqFKeJJQJdwk3DQ9SXiS8JseZsphphxmyg+/LOGJhCcJb6T8popPEm6aKgk3KYeZcpgph5nyw0sJVcKThJuEm6YnCVXCTcKThKrpRkKVUCXcJLzRVCXcpLxxmCmHmXKYKT/8ZRKqhCcJNxJuEqomvtH0JKFqqhJuEp5IqBJuUt44zJTDTDnMlB8+lnCT8ETCEwlVQpVQJdwkfFLTTcKNhCcJVVOV8MZhphxmymGm2B/8kHCT8ETCjYSbhCcJNwk3CU8SqoQnCVXCk4SbhCcJNwlvHGbKYaYcZsoPf1nCTdNN043kv0TTjaQnKVVClXCT8MZhphxmymGm/PBSyl/VdJNw03STcJNQJVQJVdOThCcJTxKqhN90mCmHmXKYKT/8ZQk3CU8SniRUCVXCjYSqid/UVCXcpPyLDjPlMFMOM+WHl1L+SsJNyicl3DTdSLiRUDVVCTcJNxJuUj7pMFMOM+UwU374WMInSdw0PZHwRMKTlKqpSrhJuEmpEm4kfNJhphxmymGm/PCXJbyR8ETCTcJ/qekmoapJQtVUJXzSYaYcZsphpvzwfyzhJuFJU5VwI+GJhCcJ/6LDTDnMlMNM+eGXpfyippsm3pDwRMKTpichvym/6TBTDjPlMFN++FjCb0qoEt5IeJLwJOFGwo2Em4QbCVXCGyk3KW8cZsphphxmiv3BzL8OM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFP+A1SpfYVdRqM0AAAAAElFTkSuQmCC');
      setUsingQr(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div>
      {usingQr ? (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code to Pay</h3>
          {qrCode ? (
            <div className="mb-4">
              <img src={qrCode} alt="UPI QR Code" className="mx-auto w-48 h-48" />
              <p className="mt-2 text-sm text-gray-600">Amount: ₹{totalAmount.toFixed(2)}</p>
            </div>
          ) : (
            <div className="animate-pulse w-48 h-48 bg-gray-200 mx-auto"></div>
          )}
          <button
            onClick={() => setUsingQr(false)}
            className="text-primary-600 underline text-sm mt-2"
          >
            Use UPI ID instead
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@upi"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>

            <button
              type="button"
              onClick={generateQrCode}
              className="py-2 px-4 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Use QR Code
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Wallet Payment Form
const WalletPaymentForm = ({ onSubmit, isProcessing }: {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}) => {
  const [walletData, setWalletData] = useState({
    walletType: 'PAYTM',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWalletData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(walletData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="walletType" className="block text-sm font-medium text-gray-700">Wallet Type</label>
        <select
          id="walletType"
          name="walletType"
          value={walletData.walletType}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="PAYTM">Paytm</option>
          <option value="PHONEPE">PhonePe</option>
          <option value="MOBIKWIK">MobiKwik</option>
        </select>
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="10-digit number"
          value={walletData.phoneNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${
          isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Main Payment Component
const Payment = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Get order data from localStorage
    const savedOrder = localStorage.getItem('cafeCurrentOrder');
    if (!savedOrder) {
      // No order data found, redirect to cart
      navigate('/cart');
      return;
    }

    try {
      const parsedOrder = JSON.parse(savedOrder);
      setOrderData(parsedOrder);
      setPaymentMethod(parsedOrder.customerInfo?.paymentMethod || 'Cash');
    } catch (err) {
      console.error('Error parsing order data:', err);
      navigate('/cart');
    }
  }, [navigate]);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!orderData) return;

    setProcessing(true);
    setError('');

    try {
      // Build the order payload
      const billData = {
        name: orderData.customerInfo.name,
        email: orderData.customerInfo.email,
        contactNumber: orderData.customerInfo.contactNumber,
        paymentMethod: paymentMethod,
        totalAmount: orderData.total,
        productDetails: JSON.stringify(
          orderData.cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
          }))
        )
      };

      // Make API call to generate bill
      const response = await billService.generateReport(billData);

      // Process payment based on method
      if (paymentMethod !== 'Cash') {
        // Add payment type details
        const paymentDetails = {
          ...paymentData,
          amount: orderData.total
        };

        // Make payment API call
        if (paymentMethod === 'Card') {
          await paymentService.processPayment({
            ...paymentDetails,
            paymentType: 'CARD'
          });
        } else if (paymentMethod === 'UPI') {
          await paymentService.processUpiPayment(paymentDetails);
        } else if (paymentMethod === 'Wallet') {
          await paymentService.processWalletPayment(paymentDetails);
        }
      }

      // Clear cart and order data from localStorage
      localStorage.removeItem('cafeCart');

      // Store bill ID for confirmation page
      localStorage.setItem('cafeLastOrderId', response.data || 'ORDER123');

      // Navigate to confirmation page
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
        <p className="text-gray-600">Complete your payment to place the order</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment method selection */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => handlePaymentMethodChange('Cash')}
                  className={`p-4 rounded-lg border ${
                    paymentMethod === 'Cash'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  } flex flex-col items-center justify-center text-center transition-colors`}
                >
                  <BanknotesIcon className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium">Cash</span>
                </button>

                <button
                  onClick={() => handlePaymentMethodChange('Card')}
                  className={`p-4 rounded-lg border ${
                    paymentMethod === 'Card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  } flex flex-col items-center justify-center text-center transition-colors`}
                >
                  <CreditCardIcon className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium">Card</span>
                </button>

                <button
                  onClick={() => handlePaymentMethodChange('UPI')}
                  className={`p-4 rounded-lg border ${
                    paymentMethod === 'UPI'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  } flex flex-col items-center justify-center text-center transition-colors`}
                >
                  <QrCodeIcon className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium">UPI</span>
                </button>

                <button
                  onClick={() => handlePaymentMethodChange('Wallet')}
                  className={`p-4 rounded-lg border ${
                    paymentMethod === 'Wallet'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  } flex flex-col items-center justify-center text-center transition-colors`}
                >
                  <DevicePhoneMobileIcon className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium">Wallet</span>
                </button>
              </div>

              {/* Payment method specific form */}
              <div className="mt-6">
                {paymentMethod === 'Cash' && (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Pay at Counter</h3>
                    <p className="text-gray-600 mb-6">You'll pay the amount when you pick up your order.</p>
                    <button
                      onClick={() => handlePaymentSubmit({})}
                      disabled={processing}
                      className={`px-6 py-2 bg-primary-600 text-white rounded-md ${
                        processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'
                      }`}
                    >
                      {processing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <CardPaymentForm onSubmit={handlePaymentSubmit} isProcessing={processing} />
                )}

                {paymentMethod === 'UPI' && (
                  <UpiPaymentForm
                    onSubmit={handlePaymentSubmit}
                    isProcessing={processing}
                    totalAmount={orderData.total}
                  />
                )}

                {paymentMethod === 'Wallet' && (
                  <WalletPaymentForm onSubmit={handlePaymentSubmit} isProcessing={processing} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Items ({orderData.cart.length})</span>
                  <span className="text-gray-900 font-medium">₹{orderData.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="text-gray-900 font-medium">₹{orderData.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-primary-700">₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><span className="font-medium">Name:</span> {orderData.customerInfo.name}</li>
                  <li><span className="font-medium">Email:</span> {orderData.customerInfo.email}</li>
                  <li><span className="font-medium">Phone:</span> {orderData.customerInfo.contactNumber}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
