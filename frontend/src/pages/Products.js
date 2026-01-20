import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useFlash } from '../contexts/FlashContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useFlash();

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

  // 👉 本地默认图片（public/images/default-product.png）
  const defaultImage = '/images/default-product.png';

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  return (
    <div className="products-page">

      {/* ===== Page Header ===== */}
      <div className="products-page-header">
        <h1 className="page-title">Items people are looking for</h1>

        <div className="post-hint">
          <h3 className="page-postTitle">Post an item for sale</h3>
          <Link to="/products/new" className="btn btn-primary create-product-link">
            Post product
          </Link>
        </div>
      </div>

      <div className="products-list">
        {products.length === 0 ? (
          <p className="text-center">No products available yet.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={
                    product.image && product.image.length > 0
                      ? product.image[0].url
                      : defaultImage
                  }
                  alt={product.name}
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
