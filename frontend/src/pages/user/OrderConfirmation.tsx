import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowDownTrayIcon, HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { billService } from '../../services';

interface OrderData {
  customerInfo: {
    name: string;
    email: string;
    contactNumber: string;
    paymentMethod: string;
  };
  cart: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [billId, setBillId] = useState<string>('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Get order data from location state or localStorage
    if (location.state?.billId && location.state?.orderData) {
      setBillId(location.state.billId);
      setOrderData(location.state.orderData);
    } else {
      // Try to get from localStorage
      const lastOrderId = localStorage.getItem('cafeLastOrderId');
      const savedOrderData = localStorage.getItem('cafeCurrentOrder');

      if (lastOrderId && savedOrderData) {
        setBillId(lastOrderId);
        try {
          setOrderData(JSON.parse(savedOrderData));
        } catch (error) {
          console.error('Error parsing order data:', error);
          navigate('/');
        }
      } else {
        // No order data found, redirect to home
        navigate('/');
      }
    }

    // Clear current order data from localStorage
    localStorage.removeItem('cafeCurrentOrder');
  }, [location, navigate]);

  const handleDownloadBill = async () => {
    if (!billId) return;

    setIsDownloading(true);
    try {
      await billService.downloadBill(parseInt(billId));
    } catch (error) {
      console.error('Error downloading bill:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { customerInfo, cart, subtotal, tax, total } = orderData;
  const formattedDate = new Date().toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-10 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order, {customerInfo.name}. Your order has been confirmed.
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full">
              <span className="text-sm font-semibold">Order #:</span>
              <span className="ml-2 text-sm font-bold">{billId}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                <p className="mt-1 text-sm text-gray-900">{formattedDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                <p className="mt-1 text-sm text-gray-900">{customerInfo.paymentMethod}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{customerInfo.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-sm text-gray-900">{customerInfo.contactNumber}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Qty
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      &nbsp;
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-medium text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      &nbsp;
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Tax (5%)
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-medium text-gray-900">
                      ₹{tax.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      &nbsp;
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-gray-900 uppercase">
                      Total
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-primary-700">
                      ₹{total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
            <p className="text-gray-600 mb-4">
              {customerInfo.paymentMethod === 'Cash'
                ? 'Please proceed to the counter with your order number to make the payment and collect your order.'
                : 'Your payment has been processed successfully. Please proceed to the counter with your order number to collect your order.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadBill}
                disabled={isDownloading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                {isDownloading ? 'Downloading...' : 'Download Receipt'}
              </button>
              <Link
                to="/order-history"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ClipboardDocumentListIcon className="mr-2 h-5 w-5" />
                View Order History
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <HomeIcon className="mr-2 h-5 w-5" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
