import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService, reviewService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error } = useFlash();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    rating: 1,
    body: '',
  });

  // Fetch product by ID
  const fetchProduct = useCallback(async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
      error('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Delete product
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        success('Product deleted successfully');
        navigate('/products');
      } catch (err) {
        error('Failed to delete product');
      }
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewService.createReview(id, {review: reviewData});
      success('Review added successfully');
      setReviewData({ rating: 1, body: '' });
      fetchProduct();
    } catch (err) {
      error('Failed to add review');
    }
  };

  // Delete review
  const handleReviewDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id, reviewId);
        success('Review deleted successfully');
        fetchProduct();
      } catch (err) {
        error('Failed to delete review');
      }
    }
  };

  // Check if current user is author
const author = product?.author?.[0];

const isAuthor =
  !!currentUser &&
  !!author &&
  !!author._id &&
  String(author._id) === String(currentUser._id);

//   useEffect(() => {
//   console.log('currentUser._id:', currentUser?._id);
//   console.log('authorId:', authorId);
//   console.log('isAuthor:', isAuthor);
// }, [currentUser, authorId, isAuthor]);

  if (loading) return <div className="container text-center mt-5">Loading...</div>;
  if (!product) return <div className="container text-center mt-5">Product not found</div>;

  return (
    <div className="product-show-container">
      {/* Product Gallery */}
      <div className="product-gallery">
        <div id="carouselProduct" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {product.image && product.image.length > 0 ? (
              product.image.map((img, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                  <img src={img.url} className="d-block w-100" alt={`${product.name} - view ${i + 1}`} />
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <img src="https://via.placeholder.com/400" className="d-block w-100" alt="Product placeholder" />
              </div>
            )}
          </div>
          {product.image && product.image.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselProduct"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselProduct"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="product-details">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-meta">
          <div>
            <p className="product-price">CATEGORY:</p>
            <p className="product-category">{product.category}</p>
          </div>
          <div>
            <p className="product-price">PRICE:</p>
            <p>${product.price}</p>
          </div>
          <div>
            <p className="product-price">ABOUT:</p>
            <p className="product-description">{product.briefDes}</p>
          </div>
          <div>
            <p className="product-price">DESCRIPTION:</p>
            <p className="product-description">{product.description}</p>
          </div>
          <div>
            <p className="product-price">LOCATION:</p>
            <p className="product-location">{product.location}</p>
          </div>

          <p className="product-author">
            Created by: {product.author?.[0]?.username || 'Author not found'}
          </p>

          {currentUser ? (
            <div>
              <p className="product-price">CONTACT:</p>
              <p>{product.contact}</p>
            </div>
          ) : (
            <div>
              <h5>
                Do you want to contact Seller? Please{' '}
                <Link className="product-price" to="/login">Login</Link> or{' '}
                <Link className="product-price" to="/register">Register</Link> first
              </h5>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="product-actions">
          <Link className="btn btn-primary" to="/products">Back to products</Link>
          {isAuthor && (
            <>
              <Link className="btn btn-secondary" to={`/products/${product._id}/edit`}>Edit</Link>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="product-reviews">
        {currentUser && (
          <>
            <h2>Leave a review</h2>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <fieldset className="starability-heart">
                  <legend>Rating:</legend>
                  {[1, 2, 3, 4, 5].map(star => (
                    <React.Fragment key={star}>
                      <input
                        type="radio"
                        id={`rate${star}`}
                        name="rating"
                        value={star}
                        checked={reviewData.rating === star}
                        onChange={e => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                      />
                      <label htmlFor={`rate${star}`}>{star} star{star > 1 ? 's' : ''}</label>
                    </React.Fragment>
                  ))}
                </fieldset>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="body">Review</label>
                <textarea
                  className="form-control"
                  id="body"
                  value={reviewData.body}
                  onChange={e => setReviewData({ ...reviewData, body: e.target.value })}
                  required
                />
              </div>
              <button className="btn btn-success" type="submit">Submit</button>
            </form>
          </>
        )}

        <div className="reviews-list">
          {product.review && product.review.length > 0 ? (
            product.review.map(r => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <p className="review-author">COMMENTED BY: {r.author?.username || 'Unknown'}</p>
                  <p className="starability-result" data-rating={r.rating}>RATED: {r.rating} stars</p>
                </div>
                <p className="review-body">SAID: {r.body}</p>
                {currentUser && r.author?._id === currentUser._id && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleReviewDelete(r._id)}>Delete</button>
                )}
              </div>
            ))
          ) : (
            <p className="no-reviews">{product.name} has no reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
