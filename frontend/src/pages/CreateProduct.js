import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useFlash } from '../contexts/FlashContext';
import './CreateProduct.css';

const categories = ['Dog', 'Cat', 'Bird', 'Fish', 'Small Pets', 'Reptile', 'Other'];

const CreateProduct = () => {
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
  const [images, setImages] = useState([]);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
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

    images.forEach((image) => {
      data.append('image', image);
    });

    try {
      await productService.createProduct(data);
      success('Product created successfully!');
      navigate('/products');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div className="product-form-container">
      <h1 className="text-center">New product adding</h1>
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
                placeholder="0.00"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please fill a valid price.</div>
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
              maxLength="100"
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
              Upload Image(s)
            </label>
            <input
              className="form-control"
              type="file"
              id="image"
              name="image"
              multiple
              onChange={handleImageChange}
              required
            />
            <div className="invalid-feedback">Please upload an image.</div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
            <Link to="/products" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
