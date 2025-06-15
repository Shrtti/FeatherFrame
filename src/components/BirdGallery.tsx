import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bird } from 'lucide-react';
import Image from 'next/image';

interface BirdData {
  _id: string;
  name: string;
  description: string;
  region: string;
  species: string;
  imageUrl: string;
  spottedAt: string;
  aiIdentified: boolean;
  confidence?: number;
}

const BirdGallery: React.FC = () => {
  const [birds, setBirds] = useState<BirdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState('');

  const regions = [
    'All Regions',
    'North',
    'South',
    'East',
    'West',
    'Central',
    'Northeast',
    'Northwest',
    'Southeast',
    'Southwest'
  ];

  useEffect(() => {
    fetchBirds();
  }, [selectedRegion]);

  const fetchBirds = async () => {
    try {
      setLoading(true);
      let url = '/api/birds';
      if (selectedRegion !== 'All Regions') {
        url = `/api/birds/region/${selectedRegion}`;
      }
      const response = await axios.get(url);
      setBirds(response.data);
      setError('');
    } catch (error: any) {
      setError('Error fetching birds');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchBirds();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/birds/search?query=${searchQuery}`);
      setBirds(response.data);
      setError('');
    } catch (error: any) {
      setError('Error searching birds');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBirds = birds.filter(bird => {
    const matchesSearch = searchQuery === '' || 
      bird.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bird.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bird.species.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow p-8 sm:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Bird Gallery</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700"
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search birds..."
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 placeholder-gray-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Image
            src="/pink-bird-bird.gif"
            alt="Loading..."
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filteredBirds.length === 0 ? (
        <div className="text-center py-12">
          <Bird className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-700">No birds found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBirds.map((bird) => (
            <div
              key={bird._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-48">
                <img
                  src={bird.imageUrl}
                  alt={bird.name}
                  className="w-full h-full object-cover"
                />
                {bird.aiIdentified && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                    AI Identified
                    {bird.confidence && (
                      <span className="ml-1">
                        ({Math.round(bird.confidence * 100)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {bird.name}
                </h3>
                <p className="text-sm text-emerald-600 mb-2">{bird.species}</p>
                <p className="text-sm text-gray-600 mb-2">{bird.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{bird.region}</span>
                  <span>
                    {new Date(bird.spottedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BirdGallery; 