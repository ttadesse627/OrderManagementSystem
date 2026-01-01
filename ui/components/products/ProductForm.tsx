'use client';

import { useState } from 'react';
import { CreateProductDto, UpdateProductDto } from '@/types/product';
import FormField from '../shared/FormField';

interface ProductFormProps {
  initialData?: Partial<CreateProductDto>;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category: initialData?.category || '',
    images: initialData?.images || [],
  });

  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleAddImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Product Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter product name"
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        required
        placeholder="Enter product description"
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <FormField
          label="Stock Quantity"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          placeholder="0"
        />
      </div>

      <FormField
        label="Category"
        name="category"
        type="text"
        value={formData.category}
        onChange={handleChange}
        required
        placeholder="e.g., Electronics, Clothing"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <div className="flex space-x-2 mb-4">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Add image URLs. At least one image is required.
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || formData.images.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}