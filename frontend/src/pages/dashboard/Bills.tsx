import { useEffect, useState } from 'react';
import billService, { IBill } from '../../services/billService';
import { DownloadIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Bills = () => {
  const [bills, setBills] = useState<IBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBill, setSelectedBill] = useState<IBill | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await billService.getAllBills();
      setBills(response.data);
    } catch (err) {
      console.error('Failed to fetch bills:', err);
      setError('Failed to load bills. Please try again later.');
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBill = (bill: IBill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const handleDownload = async (billId: number, fileName: string) => {
    try {
      await billService.downloadBill(billId);
      toast.success('Bill downloaded successfully');
    } catch (err) {
      console.error('Error downloading bill:', err);
      toast.error('Failed to download bill');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBill(null);
  };

  if (loading && bills.length === 0) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bills</h1>
          <p className="mt-2 text-sm text-gray-700">View and manage bill records</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{bill.uuid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bill.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{Number(bill.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.createdBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.paymentMethod || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewBill(bill)}
                            className="text-primary-600 hover:text-primary-900"
                            title="View Bill Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(bill.id, bill.uuid)}
                            className="text-green-600 hover:text-green-900"
                            title="Download Bill"
                          >
                            <DownloadIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bill Details Modal */}
      {showModal && selectedBill && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                  <DocumentTextIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Bill #{selectedBill.uuid}
                  </h3>

                  <div className="mt-4 text-left">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBill.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBill.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBill.contactNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBill.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBill.paymentMethod || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Created By</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBill.createdBy}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-4">
                      <h4 className="text-sm font-medium text-gray-900">Product Details</h4>
                      <div className="mt-2">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                          {selectedBill.productDetails}
                        </pre>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Total Amount:</span>
                      <span className="text-lg font-bold text-primary-600">₹{Number(selectedBill.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
