import React, { useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';
import Image from 'next/image';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, formData);
      onLogin(response.data.token, response.data.user);
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (!error.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login/Register Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-pink-100 to-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-pink-500" />
            </div>
            <h2 className="mt-6 text-3xl font-serif font-bold bg-gradient-to-r from-pink-500 to-emerald-500 bg-clip-text text-transparent">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Join our bird watching community'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-emerald-500 hover:from-pink-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-pink-600 hover:text-pink-500"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Logo and Branding */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-pink-50 to-emerald-50 p-8 sm:p-12 lg:p-16">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Image
              src="/Logo.png"
              alt="FeatherFrame Logo"
              width={120}
              height={120}
              className="mx-auto rounded-full"
            />
            <h1 className="mt-4 text-4xl font-serif font-bold bg-gradient-to-r from-pink-500 to-emerald-500 bg-clip-text text-transparent">
              FeatherFrame
            </h1>
            <p className="mt-2 text-lg text-gray-600">Discover and identify birds through AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 