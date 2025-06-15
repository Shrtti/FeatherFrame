"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, Camera, MapPin } from "lucide-react";

interface BirdFormData {
  name: string;
  description: string;
  region: string;
  species: string;
  category: string;
  uploadedBy: string;
  sightingDate: string;
  tags: string;
}

const REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Africa",
  "Asia",
  "Australia",
  "Antarctica",
];

const CATEGORIES = [
  "Songbird",
  "Raptor",
  "Waterbird",
  "Gamebird",
  "Seabird",
  "Other",
];

export default function BirdUpload() {
  const [formData, setFormData] = useState<BirdFormData>({
    name: "",
    description: "",
    region: "",
    species: "",
    category: "",
    uploadedBy: "",
    sightingDate: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", selectedFile);

    // Only append non-empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() && (!useAI || (key !== "name" && key !== "species"))) {
        uploadFormData.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/birds/upload",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Bird uploaded successfully!");
      // Reset form
      setFormData({
        name: "",
        description: "",
        region: "",
        species: "",
        category: "",
        uploadedBy: "",
        sightingDate: "",
        tags: "",
      });
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Camera className="w-6 h-6" />
        Upload Bird Photo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            required
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block text-center"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded"
              />
            ) : (
              <div className="text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-2" />
                <p>Click to upload bird photo</p>
              </div>
            )}
          </label>
        </div>

        {/* AI Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="use-ai"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="use-ai" className="text-sm">
            Let AI identify the bird automatically
          </label>
        </div>

        {/* Bird Information */}
        {!useAI && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Bird Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="species"
              placeholder="Species (Scientific Name)"
              value={formData.species}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </>
        )}

        <textarea
          name="description"
          placeholder="Description of the bird"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg h-24"
          required
        />

        <select
          name="region"
          value={formData.region}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Region</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="uploadedBy"
          placeholder="Your Name (optional)"
          value={formData.uploadedBy}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="datetime-local"
          name="sightingDate"
          value={formData.sightingDate}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload Bird Photo"}
        </button>
      </form>
    </div>
  );
}
