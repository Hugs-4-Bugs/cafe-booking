import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

// Types
interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    contactNumber: '',
    paymentMethod: 'Cash'
  });

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cafeCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Pre-fill customer info if user is logged in
    if (isAuthenticated && user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        contactNumber: user.contactNumber || prev.contactNumber
      }));
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cafeCart', JSON.stringify(cart));
  }, [cart]);

  // Handle customer info changes
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Add item to cart
  const increaseQuantity = (itemId: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Remove item from cart
  const decreaseQuantity = (itemId: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.id !== itemId || item.quantity > 0)
    );
  };

  // Remove item completely
  const removeItem = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate tax (5%)
  const calculateTax = () => {
    return calculateSubtotal() * 0.05;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Handle checkout
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.contactNumber) {
      alert('Please fill in all customer information.');
      return;
    }

    setLoading(true);

    // Store order data in localStorage for the payment page
    const orderData = {
      customerInfo,
      cart,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    };

    localStorage.setItem('cafeCurrentOrder', JSON.stringify(orderData));

    setTimeout(() => {
      setLoading(false);
      // Navigate to payment page
      navigate('/payment');
    }, 600); // Simulate processing delay
  };

  // Check if cart is empty
  const isCartEmpty = cart.length === 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-gray-600">Review your items and proceed to checkout</p>
      </div>

      {isCartEmpty ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/menu"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items ({cart.length})</h2>

                <div className="divide-y divide-gray-200">
                  {cart.map(item => (
                    <div key={item.id} className="py-4 flex">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.categoryName}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <div className="text-primary-700 font-semibold">₹{item.price}</div>

                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="text-gray-500 hover:text-primary-600 p-1"
                          >
                            <MinusIcon className="h-5 w-5" />
                          </button>

                          <span className="mx-2 w-8 text-center">{item.quantity}</span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="text-gray-500 hover:text-primary-600 p-1"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700 p-1"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="text-gray-900 font-semibold mt-2">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <Link
                    to="/menu"
                    className="inline-flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Continue Shopping
                  </Link>

                  <button
                    onClick={() => setCart([])}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary and checkout section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="text-gray-900 font-medium">₹{calculateTax().toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-primary-700">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="mt-8">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Customer Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleCustomerInfoChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={customerInfo.contactNumber}
                        onChange={handleCustomerInfoChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={customerInfo.paymentMethod}
                        onChange={handleCustomerInfoChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Credit/Debit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Wallet">Digital Wallet</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
