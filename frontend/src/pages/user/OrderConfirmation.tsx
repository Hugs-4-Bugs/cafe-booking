import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, DocumentTextIcon, HomeIcon } from '@heroicons/react/24/outline';

const OrderConfirmation = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get order ID from localStorage
    const savedOrderId = localStorage.getItem('cafeLastOrderId');
    if (!savedOrderId) {
      // No order ID found, redirect to home
      navigate('/');
      return;
    }

    setOrderId(savedOrderId);

    // Remove order data from localStorage after getting the ID
    localStorage.removeItem('cafeLastOrderId');
  }, [navigate]);

  const downloadBill = () => {
    // In a real app, this would call the API to download the bill PDF
    alert('In a real application, this would download your bill as a PDF.');

    // Example code for real implementation:
    // if (orderId) {
    //   billService.getPdf(orderId)
    //     .then(response => {
    //       const url = window.URL.createObjectURL(new Blob([response.data]));
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.setAttribute('download', `Bill-${orderId}.pdf`);
    //       document.body.appendChild(link);
    //       link.click();
    //     })
    //     .catch(error => {
    //       console.error('Error downloading bill:', error);
    //       alert('Failed to download bill. Please try again.');
    //     });
    // }
  };

  if (!orderId) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed. We'll notify you when it's ready.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h2>
          <p className="text-gray-700">Order ID: <span className="font-medium">{orderId}</span></p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={downloadBill}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Download Bill
          </button>

          <Link
            to="/order-history"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View Order History
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
