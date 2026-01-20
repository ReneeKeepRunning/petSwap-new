import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useFlash } from '../contexts/FlashContext';
import './EditProduct.css';

const categories = ['Dog', 'Cat', 'Bird', 'Fish', 'Small Pets', 'Reptile', 'Other'];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useFlash();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    briefDes: '',
    description: '',
    location: '',
    category: 'Dog',
    contact: '',
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await productService.getProductById(id);
      const product = response.data;
      setFormData({
        name: product.name,
        price: product.price,
        briefDes: product.briefDes,
        description: product.description,
        location: product.location,
        category: product.category,
        contact: product.contact,
      });
      setExistingImages(product.image || []);
    } catch (err) {
      error('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleDeleteImage = (filename) => {
    if (deleteImages.includes(filename)) {
      setDeleteImages(deleteImages.filter((f) => f !== filename));
    } else {
      setDeleteImages([...deleteImages, filename]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(`product[${key}]`, formData[key]);
    });

    newImages.forEach((image) => {
      data.append('image', image);
    });

    deleteImages.forEach((filename) => {
      data.append('deleteImages[]', filename);
    });

    try {
      await productService.updateProduct(id, data);
      success('Product updated successfully!');
      navigate(`/products/${id}`);
    } catch (err) {
      error(err.response?.data?.error || 'Failed to update product');
    }
  };

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  return (
    <div className="product-form-container">
      <h1 className="text-center">Product editing</h1>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              placeholder="Product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please fill a product name.</div>
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please fill a price.</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="briefDes" className="form-label">
              Brief Description
            </label>
            <textarea
              className="form-control"
              id="briefDes"
              name="briefDes"
              maxLength="70"
              value={formData.briefDes}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please fill a brief description.</div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Product description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              maxLength="300"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please fill a description.</div>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Pick-up point / shipping from
            </label>
            <textarea
              className="form-control"
              id="location"
              name="location"
              maxLength="100"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please fill a location.</div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category type
            </label>
            <select
              className="form-select"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contact" className="form-label">
              Contact Number:
            </label>
            <div className="input-group">
              <span className="input-group-text">+61</span>
              <input
                type="tel"
                className="form-control"
                name="contact"
                id="contact"
                placeholder="e.g. 412 345 678"
                pattern="[0-9]{9}"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div className="invalid-feedback">
              Please enter a valid contact number (9 digits).
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Adding more image(s)
            </label>
            <input
              className="form-control"
              type="file"
              id="image"
              name="image"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {existingImages.length > 0 && (
            <div className="image-preview">
              {existingImages.map((img, i) => (
                <div key={i} className="image-thumbnail">
                  <img src={img.thumbnail || img.url} className="img-thumbnail" alt={`Product ${i}`} />
                  <div className="image-actions">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={deleteImages.includes(img.filename)}
                      onChange={() => handleDeleteImage(img.filename)}
                      id={`img-${i}`}
                    />
                    <label htmlFor={`img-${i}`}>Delete</label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            <Link to={`/products/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
