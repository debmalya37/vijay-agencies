"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight, Package, Image as ImageIcon, Tag } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_category?: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategories: {
    _id: string;
    name: string;
    slug: string;
    is_active: boolean;
  }[];
  is_active: boolean;
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  product_count: number;
  products?: Product[];
  created_at: string;
  updated_at: string;
}

interface Product {
  _id: string;
  title: string;
  original_price: number;
  discounted_price?: number;
  images?: string[];
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  parent_category: string;
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showProducts, setShowProducts] = useState<{[key: string]: boolean}>({});

  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    description: '',
    parent_category: '',
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories?include_products=true');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert('Category name is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    Object.entries(categoryForm).forEach(([key, value]) => {
      if (value !== '') {
        formData.append(key, value.toString());
      }
    });

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        fetchCategories();
        setShowModal(false);
        resetForm();
        setEditingCategory(null);
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
    setLoading(false);
  };

  const deleteCategory = async (id: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      parent_category: '',
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_category: category.parent_category?._id || '',
      is_active: category.is_active,
      sort_order: category.sort_order,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || ''
    });
    setPreviewUrl(category.image_url || '');
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const toggleProducts = (categoryId: string) => {
    setShowProducts(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getTopLevelCategories = () => {
    return categories.filter(cat => !cat.parent_category);
  };

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parent_category?._id === parentId);
  };

  const renderCategoryRow = (category: Category, level: number = 0) => {
    const hasSubcategories = category.subcategories.length > 0;
    const showingProducts = showProducts[category._id];
    const products = category.products || [];

    return (
      <React.Fragment key={category._id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {hasSubcategories && (
                <ChevronRight 
                  size={16} 
                  className={`mr-2 cursor-pointer transition-transform ${showingProducts ? 'rotate-90' : ''}`}
                  onClick={() => toggleProducts(category._id)}
                />
              )}
              <div className="flex items-center">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-10 h-10 rounded-lg object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500">/{category.slug}</div>
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {category.parent_category ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {category.parent_category.name}
              </span>
            ) : (
              <span className="text-gray-400">Root Category</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center">
              <Package size={16} className="mr-1 text-gray-400" />
              {category.product_count}
              {products.length > 0 && (
                <button
                  onClick={() => toggleProducts(category._id)}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                >
                  {showingProducts ? 'Hide' : 'Show'} Products
                </button>
              )}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.sort_order}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center gap-2">
              <button
                onClick={() => editCategory(category)}
                className="text-blue-600 hover:text-blue-900"
                title="Edit Category"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteCategory(category._id, category.name)}
                className="text-red-600 hover:text-red-900"
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </tr>

        {/* Show products if toggled */}
        {showingProducts && products.length > 0 && (
          <tr>
            <td colSpan={6} className="px-6 py-2 bg-gray-50">
              <div className="ml-8">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Products in this category:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          <div className="text-sm text-gray-500">
                            {product.discounted_price ? (
                              <>
                                <span className="text-green-600 font-medium">₹{product.discounted_price}</span>
                                <span className="ml-1 line-through">₹{product.original_price}</span>
                              </>
                            ) : (
                              <span>₹{product.original_price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>
        )}

        {/* Render subcategories */}
        {getSubcategories(category._id).map(subcat => renderCategoryRow(subcat, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Organize your products with categories and subcategories</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <ChevronRight className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Root Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getTopLevelCategories().length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + cat.product_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sort Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No categories found. Create your first category to get started.
                  </td>
                </tr>
              ) : (
                getTopLevelCategories().map(category => renderCategoryRow(category))
              )}
            </tbody>
          </table>
        </div>

        {/* Category Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => {
                        setCategoryForm({
                          ...categoryForm, 
                          name: e.target.value,
                          slug: categoryForm.slug || generateSlug(e.target.value)
                        });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                      title="Slug should only contain lowercase letters, numbers, and hyphens"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Category
                    </label>
                    <select
                    title='Select Parent Category'
                      value={categoryForm.parent_category}
                      onChange={(e) => setCategoryForm({...categoryForm, parent_category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">None (Root Category)</option>
                      {categories
                        .filter(cat => cat._id !== editingCategory?._id) // Prevent self-reference
                        .map(cat => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={categoryForm.sort_order}
                      onChange={(e) => setCategoryForm({...categoryForm, sort_order: Number(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={categoryForm.meta_title}
                      onChange={(e) => setCategoryForm({...categoryForm, meta_title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={200}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={categoryForm.meta_description}
                      onChange={(e) => setCategoryForm({...categoryForm, meta_description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      maxLength={500}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={categoryForm.is_active}
                        onChange={(e) => setCategoryForm({...categoryForm, is_active: e.target.checked})}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}