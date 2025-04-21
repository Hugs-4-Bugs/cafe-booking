import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../../services';
import { IProduct } from '../../services/productService';
import { ICategory } from '../../services/categoryService';
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

// Define cart item type
interface CartItem extends IProduct {
  quantity: number;
}

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Get category from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam));
    }
  }, [searchParams]);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoryResponse = await categoryService.getAllCategories();
        setCategories(categoryResponse.data);

        // Fetch products
        const productResponse = await productService.getAllProducts();

        // Filter active products
        const activeProducts = productResponse.data.filter(
          (product) => product.status === 'true'
        );

        setProducts(activeProducts);
        setFilteredProducts(activeProducts);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu data. Please try refreshing the page.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products when category or search term changes
  useEffect(() => {
    let result = products;

    // Filter by category if selected
    if (selectedCategory) {
      result = result.filter(product => product.categoryId === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, products]);

  // Handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);

    // Update URL params
    if (categoryId) {
      setSearchParams({ category: categoryId.toString() });
    } else {
      setSearchParams({});
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Add item to cart
  const addToCart = (product: IProduct) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity if already in cart
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove item if quantity is 1
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  // Get quantity of item in cart
  const getCartQuantity = (productId: number): number => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar with categories */}
      <div className="md:w-1/4 lg:w-1/5">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
          <h2 className="text-xl font-bold mb-4">Categories</h2>

          <div className="space-y-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-100 text-primary-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Items
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:w-3/4 lg:w-4/5">
        {/* Search and cart summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto flex-1">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex items-center bg-primary-50 px-4 py-2 rounded-lg">
            <ShoppingCartIcon className="h-6 w-6 text-primary-600 mr-2" />
            <div>
              <span className="font-medium text-primary-800">{cartItemCount} items</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="font-medium text-primary-800">
                ₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Menu items */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8 bg-white rounded-lg shadow-md">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No results found for "${searchTerm}". Try a different search term.`
                : selectedCategory
                  ? "No products in this category."
                  : "No products available."}
            </p>

            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  handleCategorySelect(null);
                }}
                className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const quantity = getCartQuantity(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.categoryName}</p>
                      </div>
                      <div className="bg-primary-50 px-3 py-1 rounded-full text-primary-700 font-semibold">
                        ₹{product.price}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-2">{product.description}</p>

                    {quantity > 0 ? (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-primary-100 rounded-full p-1 text-primary-700 hover:bg-primary-200"
                        >
                          <MinusIcon className="h-6 w-6" />
                        </button>

                        <span className="font-semibold text-lg">{quantity}</span>

                        <button
                          onClick={() => addToCart(product)}
                          className="bg-primary-600 rounded-full p-1 text-white hover:bg-primary-700"
                        >
                          <PlusIcon className="h-6 w-6" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
                      >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
