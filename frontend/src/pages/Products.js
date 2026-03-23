import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useFlash } from '../contexts/FlashContext';
import './Products.css';
import { getOptimizedImage } from '../utils/cloudinary';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(''); // 🔥 search input
  const { error } = useFlash();

  // 👉 获取全部产品
  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await productService.searchProducts(query);
      setProducts(response.data);
    } catch (err) {
      error('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const defaultImage = '/images/default-product.png';

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  return (
    <div className="products-page">

      {/* ===== Header ===== */}
      <div className="products-page-header">
        <div className='title-search'>
        <h1 className="page-title">Items people are looking for</h1>

        {/* 🔍 搜索栏 */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        </div>

        <div className="post-hint">
          <h3 className="page-postTitle">Post an item for sale</h3>
          <Link to="/products/new" className="btn btn-primary create-product-link">
            Post product
          </Link>
        </div>
      </div>

      {/* ===== Product List ===== */}
      <div className="products-list">
        {products.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={getOptimizedImage(
                    product.image && product.image.length > 0
                      ? product.image[0].url
                      : defaultImage
                  , 360)
                  }
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-description">{product.briefDes}</p>

                <Link className="review-btn" to={`/products/${product._id}`}>
                  View details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Products;