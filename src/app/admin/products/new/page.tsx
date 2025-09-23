// src/app/admin/products/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Variant {
  label: string; // e.g. "2kg", "5kg", "10L"
  unit: "kg" | "g" | "l" | "ml";
  value: number; // numeric value (e.g., 2, 5, 10)
  price: number; // regular price
  discounted_price?: number; // discounted price if available
  stock: number;
  images: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  is_active: boolean;
  parent_category?: {
    name: string;
    slug: string;
  };
}

export default function NewProductPage() {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    base_price: 0,
    discounted_price: undefined as number | undefined,
    variants: [] as Variant[],
    is_in_stock: true,
    is_featured: false,
    categories: [''],
    category_ids: [] as string[],
    images: [''],
    tags: [''],
    min_order_quantity: 1,
    seller_id: '',
    meta_title: '',
    meta_description: '',
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [autoSlug, setAutoSlug] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [variantImageFiles, setVariantImageFiles] = useState<Record<number, File[]>>({});

  const router = useRouter();

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get('/api/categories');
        if (response.data.success) {
          setAvailableCategories(response.data.categories.filter((cat: Category) => cat.is_active));
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Failed to load categories');
        // Set some dummy categories for development if API fails
        setAvailableCategories([
          { _id: '1', name: 'Electronics', slug: 'electronics', is_active: true },
          { _id: '2', name: 'Clothing', slug: 'clothing', is_active: true },
          { _id: '3', name: 'Books', slug: 'books', is_active: true },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (autoSlug && form.title) {
      setForm(f => ({ ...f, slug: generateSlug(form.title) }));
    }
  }, [form.title, autoSlug]);

  const handleChange = (key: string, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleArrayChange = (key: 'categories' | 'images' | 'tags', idx: number, value: string) =>
    setForm(f => {
      const arr = [...f[key]];
      arr[idx] = value;
      return { ...f, [key]: arr };
    });

  const addArrayField = (key: 'categories' | 'images' | 'tags') =>
    setForm(f => ({ ...f, [key]: [...f[key], ''] }));

  const removeArrayField = (key: 'categories' | 'images' | 'tags', idx: number) =>
    setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));

  // Category selection handlers
  const selectCategory = (idx: number, categoryName: string, categoryId: string) => {
    handleArrayChange('categories', idx, categoryName);
    
    // Update category IDs
    setForm(f => {
      const newCategoryIds = [...f.category_ids];
      newCategoryIds[idx] = categoryId;
      return { ...f, category_ids: newCategoryIds };
    });
    
    setShowCategoryDropdown(null);
    
    // Update selected categories for filtering
    const newSelected = [...selectedCategories];
    newSelected[idx] = categoryName;
    setSelectedCategories(newSelected);
  };

  const getFilteredCategories = (currentValue: string, currentIndex: number) => {
    return availableCategories.filter(cat => 
      cat.name.toLowerCase().includes(currentValue.toLowerCase()) &&
      !selectedCategories.includes(cat.name) // Don't show already selected categories
    );
  };

  // --- Variant handlers ---
  const addVariant = () =>
    setForm(f => ({
      ...f,
      variants: [...f.variants, { 
        label: '', 
        unit: 'kg' as const, 
        value: 0, 
        price: 0, 
        stock: 0, 
        images: [''] 
      }],
    }));

  const updateVariant = (idx: number, field: keyof Variant, value: any) =>
    setForm(f => {
      const vs = [...f.variants];
      (vs[idx] as any)[field] = value;
      return { ...f, variants: vs };
    });

  const addVariantImage = (idx: number) =>
    setForm(f => {
      const vs = [...f.variants];
      vs[idx].images.push('');
      return { ...f, variants: vs };
    });

  const updateVariantImage = (vidx: number, iidx: number, url: string) =>
    setForm(f => {
      const vs = [...f.variants];
      vs[vidx].images[iidx] = url;
      return { ...f, variants: vs };
    });

  const removeVariantImage = (vidx: number, iidx: number) =>
    setForm(f => {
      const vs = [...f.variants];
      vs[vidx].images.splice(iidx, 1);
      return { ...f, variants: vs };
    });

  const removeVariant = (idx: number) => {
    setForm(f => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== idx),
    }));
    
    // Remove variant image files for this index
    setVariantImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[idx];
      return newFiles;
    });
  };

  const handleVariantImageFiles = (variantIndex: number, files: File[]) => {
    setVariantImageFiles(prev => ({
      ...prev,
      [variantIndex]: files
    }));
  };

  const submit = async () => {
    if (!form.title.trim()) {
      alert('Product title is required');
      return;
    }
    if (form.categories.filter(c => c.trim()).length === 0) {
      alert('At least one category is required');
      return;
    }
    if (form.variants.length === 0) {
      alert('At least one variant is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('slug', form.slug || generateSlug(form.title));
      fd.append('description', form.description);
      fd.append('base_price', String(form.base_price));
      if (form.discounted_price) fd.append('discounted_price', String(form.discounted_price));
      fd.append('is_in_stock', form.is_in_stock ? 'true' : 'false');
      fd.append('is_featured', form.is_featured ? 'true' : 'false');
      fd.append('min_order_quantity', String(form.min_order_quantity));
      if (form.seller_id) fd.append('seller_id', form.seller_id);
      if (form.meta_title) fd.append('meta_title', form.meta_title);
      if (form.meta_description) fd.append('meta_description', form.meta_description);

      // categories & category_ids & tags as multiple fields
      form.categories.filter(c => c.trim()).forEach(c => fd.append('categories[]', c));
      form.category_ids.filter(id => id.trim()).forEach(id => fd.append('category_ids[]', id));
      form.tags.filter(t => t.trim()).forEach(t => fd.append('tags[]', t));

      // existing image URLs (if any)
      form.images.filter(i => i.trim()).forEach(url => fd.append('images[]', url));
      // files selected to upload for product images
      imageFiles.forEach(file => fd.append('images[]', file));

      // variants: send JSON for variant metadata (without file objects)
      const variantsForServer = form.variants.map(v => ({
        ...v,
        images: (v.images || []).filter(Boolean), // keep any URL-type images typed in UI
        stock: Number(v.stock ?? 0),
        price: Number(v.price ?? 0),
        discounted_price: v.discounted_price ? Number(v.discounted_price) : undefined,
        value: Number(v.value ?? 0),
      }));
      fd.append('variants', JSON.stringify(variantsForServer));
      
      // for each variant index, append associated files under variantImages-{index}
      Object.entries(variantImageFiles).forEach(([idxStr, files]) => {
        const idx = Number(idxStr);
        (files || []).forEach(file => fd.append(`variantImages-${idx}`, file));
      });

      // POST to admin products endpoint
      const response = await axios.post('/api/admin/products', fd, {
        headers: {
          // intentionally empty to let browser set multipart boundary
        },
      });

      if (response.status === 201 || response.data) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        alert('Error saving product');
      }
    } catch (err: any) {
      console.error('Error creating product:', err);
      alert(err.response?.data?.message || err.response?.data?.error || String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Add New Product
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create a new product for your B2B marketplace
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Title */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter product title"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Slug (URL-friendly name)
                    <span className="text-slate-400 text-sm ml-2">
                      {autoSlug ? '(Auto-generated)' : '(Manual)'}
                    </span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={form.slug}
                      onChange={e => {
                        handleChange('slug', e.target.value);
                        setAutoSlug(false);
                      }}
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="product-url-name"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSlug(true);
                        handleChange('slug', generateSlug(form.title));
                      }}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                    >
                      Auto
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  placeholder="Product description"
                  maxLength={2000}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {form.description.length}/2000 characters
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Base Pricing
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Base Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.base_price}
                    onChange={e => handleChange('base_price', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Discounted Price (₹) - Optional
                  </label>
                  <input
                    type="number"
                    value={form.discounted_price || ''}
                    onChange={e => handleChange('discounted_price', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="number"
                    value={form.min_order_quantity}
                    onChange={e => handleChange('min_order_quantity', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-4 pt-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_in_stock}
                      onChange={e => handleChange('is_in_stock', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      In Stock
                    </span>
                  </label>
                </div>
                <div className="flex items-center space-x-4 pt-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={e => handleChange('is_featured', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Featured Product
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Categories <span className="text-red-500">*</span>
                </h2>
                {categoriesLoading && (
                  <span className="text-slate-500 text-sm">Loading categories...</span>
                )}
                {categoriesError && (
                  <span className="text-red-500 text-sm">{categoriesError}</span>
                )}
              </div>
            </div>
            <div className="p-6">
              {form.categories.map((c, i) => (
                <div key={i} className="relative mb-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        value={c}
                        onChange={e => {
                          handleArrayChange('categories', i, e.target.value);
                          if (e.target.value && !categoriesLoading) {
                            setShowCategoryDropdown(i);
                          } else {
                            setShowCategoryDropdown(null);
                          }
                        }}
                        onFocus={() => !categoriesLoading && setShowCategoryDropdown(i)}
                        onBlur={() => setTimeout(() => setShowCategoryDropdown(null), 150)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Select or type category name"
                        disabled={categoriesLoading}
                      />
                      
                      {/* Category Dropdown */}
                      {showCategoryDropdown === i && !categoriesLoading && (
                        <div className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-b-lg shadow-lg max-h-48 overflow-y-auto">
                          {getFilteredCategories(c, i).map(cat => (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => selectCategory(i, cat.name, cat._id)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 border-b border-slate-200 dark:border-slate-600 last:border-b-0 transition-colors"
                            >
                              <div className="text-slate-800 dark:text-slate-200 font-medium">{cat.name}</div>
                              {cat.parent_category && (
                                <div className="text-slate-500 dark:text-slate-400 text-sm">
                                  Parent: {cat.parent_category.name}
                                </div>
                              )}
                            </button>
                          ))}
                          {getFilteredCategories(c, i).length === 0 && c.trim() && (
                            <div className="px-4 py-3 text-slate-500 dark:text-slate-400 italic">
                              No matching categories found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {form.categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          removeArrayField('categories', i);
                          const newSelected = [...selectedCategories];
                          newSelected.splice(i, 1);
                          setSelectedCategories(newSelected);
                        }}
                        className="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayField('categories')}
                className="px-6 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200"
                disabled={categoriesLoading}
              >
                + Add Category
              </button>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Product Images
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {form.images.map((url, i) => (
                <div key={i} className="flex space-x-3">
                  <input
                    value={url}
                    onChange={e => handleArrayChange('images', i, e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('images', i)}
                      className="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Or upload image files
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles(files);
                  }}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-blue-900 dark:file:text-blue-300
                    dark:hover:file:bg-blue-800"
                />
                {imageFiles.length > 0 && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {imageFiles.length} file(s) selected for upload
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => addArrayField('images')}
                className="px-6 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200"
              >
                + Add Image URL
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Tags
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {form.tags.map((tag, i) => (
                <div key={i} className="flex space-x-3">
                  <input
                    value={tag}
                    onChange={e => handleArrayChange('tags', i, e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter tag"
                  />
                  {form.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('tags', i)}
                      className="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('tags')}
                className="px-6 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                SEO Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={e => handleChange('meta_title', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="SEO title for search engines"
                  maxLength={200}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {form.meta_title.length}/200 characters
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={form.meta_description}
                  onChange={e => handleChange('meta_description', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="SEO description for search engines"
                  maxLength={500}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {form.meta_description.length}/500 characters
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Seller ID (Optional)
                </label>
                <input
                  type="text"
                  value={form.seller_id}
                  onChange={e => handleChange('seller_id', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter seller ID"
                />
              </div>
            </div>
          </div>

          {/* Product Variants - REQUIRED */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Product Variants <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                At least one variant is required (e.g., 1kg, 500g, 2L, etc.)
              </p>
            </div>
            <div className="p-6 space-y-6">
              {form.variants.map((v, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                      Variant #{i + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        placeholder="e.g., 2kg, 500ml"
                        value={v.label}
                        onChange={e => updateVariant(i, 'label', e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                      title="Select unit"
                        value={v.unit}
                        onChange={e => updateVariant(i, 'unit', e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="l">Liter (l)</option>
                        <option value="ml">Milliliter (ml)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 2, 500"
                        value={v.value || ''}
                        onChange={e => updateVariant(i, 'value', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Stock quantity"
                        value={v.stock || ''}
                        onChange={e => updateVariant(i, 'stock', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Regular price"
                        value={v.price || ''}
                        onChange={e => updateVariant(i, 'price', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Discounted Price (₹) - Optional
                      </label>
                      <input
                        type="number"
                        placeholder="Discounted price"
                        value={v.discounted_price || ''}
                        onChange={e => updateVariant(i, 'discounted_price', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-slate-800 dark:text-slate-100 mb-3">
                      Variant Images
                    </h4>
                    {v.images.map((img, j) => (
                      <div key={j} className="flex space-x-3 mb-3">
                        <input
                          placeholder="https://example.com/variant-image.jpg"
                          value={img}
                          onChange={e => updateVariantImage(i, j, e.target.value)}
                          className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        {v.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantImage(i, j)}
                            className="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-4 space-y-3">
                      <button
                        type="button"
                        onClick={() => addVariantImage(i)}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200"
                      >
                        + Add Image URL
                      </button>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Or upload variant images
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={e => {
                            const files = Array.from(e.target.files || []);
                            handleVariantImageFiles(i, files);
                          }}
                          className="block w-full text-sm text-slate-500 dark:text-slate-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            dark:file:bg-blue-900 dark:file:text-blue-300
                            dark:hover:file:bg-blue-800"
                        />
                        {variantImageFiles[i] && variantImageFiles[i].length > 0 && (
                          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {variantImageFiles[i].length} file(s) selected for upload
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addVariant}
                className="w-full px-6 py-4 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-lg transition-all duration-200 border-2 border-dashed border-green-300 dark:border-green-700"
              >
                + Add New Variant
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={submit}
                disabled={isSubmitting}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Product...</span>
                  </div>
                ) : (
                  'Create Product'
                )}
              </button>
              <button
                onClick={() => router.push('/admin/products')}
                disabled={isSubmitting}
                className="px-8 py-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}