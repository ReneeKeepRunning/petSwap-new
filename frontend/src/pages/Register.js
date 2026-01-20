import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const { register } = useAuth();
  const { success, error } = useFlash();
  const navigate = useNavigate();

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

    const result = await register(formData);

    if (result.success) {
      success('Registration successful!');
      navigate('/products');
    } else {
      error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="container justify-content-center align-items-center my-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Register</h5>
              <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    autoFocus
                    required
                  />
                  <div className="invalid-feedback">Please enter a username.</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter a valid email.</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter a password.</div>
                </div>

                <button className="btn btn-success w-100" type="submit">
                  Sign up
                </button>
              </form>
              <p className="mt-3">Already have an account?</p>
              <Link to="/login" className="btn btn-success btn-block w-100">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
