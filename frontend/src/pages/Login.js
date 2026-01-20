import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const { login } = useAuth();
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

    const result = await login(formData);

    if (result.success) {
      success('Login successful!');
      navigate('/products');
    } else {
      error(result.error || 'Login failed');
    }
  };

  return (
    <div className="container justify-content-center align-items-center mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Login</h5>
              <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Username:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter a valid username.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password:
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Password cannot be empty.</div>
                </div>
                <button className="btn btn-success btn-block w-100" type="submit">
                  Login
                </button>
              </form>
              <p className="mt-3">Don't have an account yet?</p>
              <Link to="/register" className="btn btn-success btn-block w-100">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
