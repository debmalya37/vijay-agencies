'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { X, Plus, Upload, Trash2, Save, Image as ImageIcon } from 'lucide-react';

type Variant = {
  _id?: string;
  label: string;
  unit: "kg" | "g" | "l" | "ml" | "ps";
  value: number;
  price: number;
  discounted_price?: number;
  stock: number;
  images?: string[];
};

type Review = {
  _id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

type ProductForm = {
  title: string;
  slug: string;
  description: string;
  base_price: number;
  discounted_price?: number;
  variants: Variant[];
  is_in_stock: boolean;
  images?: string[];
  reviews?: Review[];
  categories: string[];
  tags: string[];
  seller_id?: string;
  min_order_quantity?: number;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images' | 'seo'>('basic');

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setForm(res.data))
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  const handle = (key: keyof ProductForm, value: any) => {
    setForm(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    handle('variants', newVariants);
  };

  const addVariant = () => {
    handle('variants', [
      ...form.variants,
      { label: '', unit: 'kg', value: 0, price: 0, stock: 0, images: [] }
    ]);
  };

  const removeVariant = (index: number) => {
    handle('variants', form.variants.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    handle('categories', [...form.categories, '']);
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...form.categories];
    newCategories[index] = value;
    handle('categories', newCategories);
  };

  const removeCategory = (index: number) => {
    handle('categories', form.categories.filter((_, i) => i !== index));
  };

  const addTag = () => {
    handle('tags', [...form.tags, '']);
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...form.tags];
    newTags[index] = value;
    handle('tags', newTags);
  };

  const removeTag = (index: number) => {
    handle('tags', form.tags.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVariant: boolean = false, variantIndex?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In a real app, upload to your storage service (S3, Cloudinary, etc.)
    // For now, we'll convert to base64 or use a placeholder
    const file = files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      if (isVariant && variantIndex !== undefined) {
        const newVariants = [...form.variants];
        const currentImages = newVariants[variantIndex].images || [];
        newVariants[variantIndex] = {
          ...newVariants[variantIndex],
          images: [...currentImages, base64String]
        };
        handle('variants', newVariants);
      } else {
        const currentImages = form.images || [];
        handle('images', [...currentImages, base64String]);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number, isVariant: boolean = false, variantIndex?: number) => {
    if (isVariant && variantIndex !== undefined) {
      const newVariants = [...form.variants];
      const currentImages = newVariants[variantIndex].images || [];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        images: currentImages.filter((_, i) => i !== index)
      };
      handle('variants', newVariants);
    } else {
      handle('images', (form.images || []).filter((_, i) => i !== index));
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.patch(`/api/products/${id}`, form);
      router.push('/admin/products');
    } catch (err) {
      setError('Failed to update product');
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'variants', label: 'Variants' },
    { id: 'images', label: 'Images' },
    { id: 'seo', label: 'SEO & Meta' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-1">{form.title || 'Untitled Product'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/products')}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => handle('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={e => handle('slug', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="product-slug"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => handle('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price
                    </label>
                    <input
                      type="number"
                      value={form.base_price || ''}
                      onChange={e => handle('base_price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      value={form.discounted_price || ''}
                      onChange={e => handle('discounted_price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Order Quantity
                    </label>
                    <input
                      type="number"
                      value={form.min_order_quantity || 1}
                      onChange={e => handle('min_order_quantity', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller ID
                    </label>
                    <input
                      type="text"
                      value={form.seller_id || ''}
                      onChange={e => handle('seller_id', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_in_stock}
                      onChange={e => handle('is_in_stock', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={e => handle('is_featured', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {form.categories.map((cat, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={cat}
                          onChange={e => updateCategory(i, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Category name"
                        />
                        <button
                          onClick={() => removeCategory(i)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addCategory}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tags
                  </label>
                  <div className="space-y-2">
                    {form.tags.map((tag, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={e => updateTag(i, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tag name"
                        />
                        <button
                          onClick={() => removeTag(i)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addTag}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage different sizes, weights, or quantities</p>
                  </div>
                  <button
                    onClick={addVariant}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {form.variants.map((variant, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Variant {i + 1}</h4>
                        <button
                          onClick={() => removeVariant(i)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Label *
                          </label>
                          <input
                            type="text"
                            value={variant.label}
                            onChange={e => handleVariant(i, 'label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 2kg, 5L"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Value *
                          </label>
                          <input
                            type="number"
                            value={variant.value}
                            onChange={e => handleVariant(i, 'value', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 2, 5, 10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit *
                          </label>
                          <select
                          title='Unit'
                            value={variant.unit}
                            onChange={e => handleVariant(i, 'unit', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="kg">Kilogram (kg)</option>
                            <option value="g">Gram (g)</option>
                            <option value="l">Liter (l)</option>
                            <option value="ml">Milliliter (ml)</option>
                            <option value="ps">Piece (ps)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                          </label>
                          <input
                            type="number"
                            value={variant.price}
                            onChange={e => handleVariant(i, 'price', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discounted Price
                          </label>
                          <input
                            type="number"
                            value={variant.discounted_price || ''}
                            onChange={e => handleVariant(i, 'discounted_price', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock *
                          </label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={e => handleVariant(i, 'stock', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Variant Images
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {(variant.images || []).map((img, imgIdx) => (
                            <div key={imgIdx} className="relative group">
                              <img
                                src={img}
                                alt={`Variant ${i + 1} image ${imgIdx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => removeImage(imgIdx, true, i)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(e, true, i)}
                              className="hidden"
                            />
                            <Plus className="w-6 h-6 text-gray-400" />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {form.variants.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No variants added yet</p>
                      <button
                        onClick={addVariant}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Variant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Images</h3>
                  <p className="text-sm text-gray-500">Upload images for the main product gallery</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(form.images || []).map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`Product image ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e)}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                  </label>
                </div>

                {(!form.images || form.images.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No images uploaded yet</p>
                    <p className="text-sm text-gray-500">Click the upload button to add product images</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO & Meta Information</h3>
                  <p className="text-sm text-gray-500">Optimize your product for search engines</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.meta_title || ''}
                    onChange={e => handle('meta_title', e.target.value)}
                    maxLength={200}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO optimized title"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(form.meta_title || '').length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={form.meta_description || ''}
                    onChange={e => handle('meta_description', e.target.value)}
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO optimized description"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(form.meta_description || '').length}/500 characters
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">SEO Preview</h4>
                  <div className="space-y-1">
                    <p className="text-blue-600 text-lg">{form.meta_title || form.title}</p>
                    <p className="text-green-700 text-sm">yoursite.com/products/{form.slug}</p>
                    <p className="text-gray-700 text-sm">
                      {form.meta_description || form.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {form.reviews && form.reviews.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {form.reviews.map(review => (
                <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{review.rating}/5</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm italic">&quot;{review.comment}&quot;</p>
                  <p className="text-xs text-gray-500 mt-1">User ID: {review.user_id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}