import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image as ImageIcon, Plus } from 'lucide-react';

interface BirdSuggestion {
  name: string;
  species: string;
}

interface FormData {
  name: string;
  description: string;
  region: string;
  species: string;
  images: File[];
}

const BirdUpload: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    region: '',
    species: '',
    images: []
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestions, setSuggestions] = useState<BirdSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const regions = [
    'North', 'South', 'East', 'West', 'Central',
    'Northeast', 'Northwest', 'Southeast', 'Southwest'
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.name.length > 2) {
        try {
          const response = await axios.get(`/api/birds/suggestions?query=${formData.name}`);
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: filesArray
      }));

      const newPreviews: string[] = [];
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === filesArray.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });

      if (filesArray.length === 0) {
        setPreviews([]);
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSuggestionClick = (suggestion: BirdSuggestion) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      species: suggestion.species
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('region', formData.region);
      formDataToSend.append('species', formData.species);
      
      formData.images.forEach((image) => {
        formDataToSend.append(`images`, image);
      });

      await axios.post('/api/birds', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Bird uploaded successfully!');
      setFormData({
        name: '',
        description: '',
        region: '',
        species: '',
        images: []
      });
      setPreviews([]);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error uploading bird');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 sm:p-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Bird Photo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
            Bird Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter bird name"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    <div className="text-sm text-gray-600">{suggestion.species}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 placeholder-gray-500"
            placeholder="Describe the bird's appearance, behavior, etc."
          />
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-800 mb-2">
            Region
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
            required
          >
            <option value="">Select a region</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-800 mb-2">
            Species
          </label>
          <input
            type="text"
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 placeholder-gray-500"
            placeholder="Enter bird species"
            required
          />
        </div>

        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-800 mb-2">
            Bird Photos
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
            <div className="space-y-1 text-center">
              {previews.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow-md hover:bg-red-600 transition-colors"
                      >
                        <Plus className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-transparent rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                >
                  <span>Upload your bird photos</span>
                  <input
                    id="image-upload"
                    name="images"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                    multiple
                    required={previews.length === 0}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              {previews.length > 0 && (
                <p className="text-sm text-gray-700 mt-2">{previews.length} image(s) selected</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="text-emerald-500 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-emerald-500 hover:from-pink-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Uploading...' : 'Upload Bird'}
        </button>
      </form>
    </div>
  );
};

export default BirdUpload; 