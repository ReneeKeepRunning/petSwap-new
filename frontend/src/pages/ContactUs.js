import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { contactService } from '../services/api';
import './ContactUs.css';

const ContactUs = () => {
  const { currentUser } = useAuth();
  const { success, error } = useFlash();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await contactService.sendMessage(formData);
      success('Message sent successfully!');
      navigate('/');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to send message');
    }
  };

  return (
    <div className="contact-container">
      <h1 className="text-center">Contact Us</h1>
      {currentUser ? (
        <p>Welcome, {currentUser.username}! Feel free to reach out to us below:</p>
      ) : (
        <p>We'd love to hear from you. Please use the form below to get in touch!</p>
      )}
      <form onSubmit={handleSubmit} className={`mt-4 ${validated ? 'was-validated' : ''}`} noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Your Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please enter your name.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Your Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please enter a valid email.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Your Message
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please enter your message.</div>
        </div>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
