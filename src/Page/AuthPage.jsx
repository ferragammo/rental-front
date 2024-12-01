import React from 'react';
import AuthForm from './AuthForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (event, path) => {
    event.preventDefault(); 
    navigate(path); 
  };

  const isLogin = location.pathname === '/auth/login';

  return (
    <div className="bg-[#09090b] font-geist h-screen flex flex-col justify-center items-center">
      <div className="xl:w-1/4 sm:w-1/4 md:w-1/2 lg:w-1/3">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-10">
            {isLogin
              ? 'Use your email and password to sign in'
              : 'Create an account with your email and password'}
          </p>
        </div>
        <AuthForm isLogin={isLogin} />
        <p className="text-center text-sm text-gray-600 mt-8 dark:text-zinc-400">
          {"Don't have an account? "}
          <Link
            onClick={(e) =>
              handleNavigation(e, isLogin ? '/auth/register' : '/auth/login')
            }
            className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
          {' for free.'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
