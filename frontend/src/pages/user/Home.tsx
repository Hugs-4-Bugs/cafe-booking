import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../../services';
import { IProduct } from '../../services/productService';
import { ICategory } from '../../services/categoryService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoryResponse = await categoryService.getAllCategories();
        setCategories(categoryResponse.data);

        // Fetch products
        const productResponse = await productService.getAllProducts();

        // Filter out active products for featured section
        const activeProducts = productResponse.data.filter(
          (product) => product.status === 'true'
        );

        // Take up to 6 products for featured section
        setFeaturedProducts(activeProducts.slice(0, 6));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try refreshing the page.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-700 py-16 md:py-24 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-600 opacity-90"></div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Welcome to Our Café Management System
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Delicious food, excellent service, and a cozy atmosphere. Explore our menu and order online today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/menu"
              className="btn btn-primary bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-md text-base font-medium"
            >
              Explore Menu
            </Link>
            <Link
              to="/cart"
              className="btn bg-primary-900 text-white hover:bg-primary-800 px-8 py-3 rounded-md text-base font-medium"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Categories</h2>
          <p className="text-gray-600">Explore our diverse menu categories</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl text-primary-700">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Items</h2>
          <p className="text-gray-600">Try our most popular items</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{product.categoryName}</p>
                    </div>
                    <div className="bg-primary-50 px-3 py-1 rounded-full text-primary-700 font-semibold">
                      ₹{product.price}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <button className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/menu"
            className="inline-block px-6 py-3 bg-white border border-primary-600 rounded-md text-primary-600 font-medium hover:bg-primary-50 transition-colors"
          >
            View Full Menu
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-gray-50 rounded-lg my-8">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">About Our Café</h2>
          <p className="text-gray-700 mb-6">
            Our café offers a warm and inviting atmosphere where customers can enjoy freshly brewed coffee and delicious meals.
            We take pride in our carefully crafted menu, featuring both classic favorites and innovative creations.
          </p>
          <p className="text-gray-700 mb-6">
            Whether you're looking for a quick breakfast, a leisurely lunch, or a sweet treat, our café has something for everyone.
            All our ingredients are sourced from local suppliers, ensuring the highest quality and freshness.
          </p>
          <div className="flex justify-center">
            <Link
              to="/menu"
              className="btn btn-primary px-6 py-2"
            >
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
