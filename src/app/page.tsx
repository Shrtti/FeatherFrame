'use client';

import { useState, useEffect } from 'react';
import BirdUpload from '../components/BirdUpload';
import BirdGallery from '../components/BirdGallery';
import Login from '../components/Login';
import axios from 'axios';
import Tabs from '@/components/Tabs';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  const tabs = [
    {
      id: 'gallery',
      label: 'Bird Gallery',
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      id: 'upload',
      label: 'Upload Bird',
      icon: <Upload className="h-5 w-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Image
          src="/pink-bird-bird.gif"
          alt="Loading..."
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/Logo.png"
                alt="FeatherFrame Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h1 className="text-xl font-serif bg-gradient-to-r from-pink-500 to-emerald-500 bg-clip-text text-transparent">FeatherFrame</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-emerald-500 hover:from-pink-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 rounded-lg shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            {activeTab === 'gallery' ? (
              <BirdGallery />
            ) : (
              <BirdUpload />
            )}
          </div>
        </div>
        </div>
      </main>
  );
}
