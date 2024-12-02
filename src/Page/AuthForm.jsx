import React, { useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/securityApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ContextApp } from '../utils/Context';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });
  const { getAllChats } = useContext(ContextApp);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: !email,
      password: !password,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    if (isLogin) {
      try {
        const result = await loginUser(email, password);

        if (result.successful) {
          const { accessToken } = result.data;

          if (accessToken) {
            Cookies.set('accessToken', accessToken.value, {
              expires: 30,
              path: '/',
            });
          }

          getAllChats();

          navigate('/');
        } else {
          const status = result.error?.status;
          if (status === 403) {
            setError(result.error?.message || 'Login failed');
          }
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.error.message
          : error.message;

        setError(errorMessage || 'An unexpected error occurred.');
      }
    } else {
      try {
        const result = await registerUser(email, password);

        if (result.successful) {
          navigate('/auth/login');
        } else {
          setError(result.error?.message || 'Registration failed');
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.error.message
          : error.message;

        setError(errorMessage || 'An unexpected error occurred.');
      }
    }

    setErrors({ email: false, password: false });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col px-8">
      <div className="flex flex-col gap-1">
        {/* Email Label */}
        <label htmlFor="email" className="text-[#b2b2b6] text-sm">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          required
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@acme.com"
          className={`bg-[#272729] ${
            email ? 'bg-[#232938]' : ''
          } text-white p-2.5 rounded-md text-sm w-full ${
            errors.email || error ? 'bg-red-500 bg-opacity-30' : 'bg-[#232938]'
          } focus:bg-[#232938] focus:outline-none mb-4`}
        />
      </div>

      <div className="flex flex-col gap-1">
        {/* Password Label */}
        <label htmlFor="password" className="text-[#b2b2b6] text-sm">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`bg-[#272729] ${
            password ? 'bg-[#232938]' : ''
          } text-white p-2.5 rounded-md text-sm w-full ${
            errors.password || error
              ? 'bg-red-500 bg-opacity-30'
              : 'bg-[#232938]'
          } focus:bg-[#232938] focus:outline-none mb-2`}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 py-2.5 bg-[#00407d] hover:bg-[#00417deb] text-sm text-white font-bold rounded-md transition"
      >
        {isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
