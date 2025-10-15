// components/admin/CSVImportModal.tsx
'use client';

import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';

interface CSVRow {
  'S.No.'?: string;
  'Product name': string;
  'Specification': string;
  'basic rate': string;
  'gst': string;
  'rates with gst': string;
  'Unit': string;
  'HSN'?: string;
}

interface ProcessedProduct {
  title: string;
  slug: string;
  description: string;
  base_price: number;
  variants: Array<{
    label: string;
    unit: string;
    value: number;
    price: number;
    stock: number;
    images: string[];
  }>;
  is_in_stock: boolean;
  is_featured: boolean;
  categories: string[];
  category_ids: string[];
  images: string[];
  tags: string[];
  min_order_quantity: number;
  hsn?: string;
  gst?: number;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CSVImportModal({ isOpen, onClose, onSuccess }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<ProcessedProduct[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const parseUnit = (unitStr: string): { unit: string; value: number } => {
    const lowerUnit = unitStr.toLowerCase().trim();
    
    // Match patterns like "Each", "Doz", etc.
    if (lowerUnit.includes('each') || lowerUnit.includes('pc')) {
      return { unit: 'ps', value: 1 };
    }
    if (lowerUnit.includes('doz')) {
      return { unit: 'ps', value: 12 };
    }
    
    // Default to pieces
    return { unit: 'ps', value: 1 };
  };

  const processCSV = (data: CSVRow[]) => {
    const products: ProcessedProduct[] = [];
    
    data.forEach((row, index) => {
      try {
        // Skip empty rows or header rows
        if (!row['Product name'] || row['Product name'].toLowerCase().includes('product name')) {
          return;
        }

        const title = row['Product name'].trim();
        const specification = row['Specification']?.trim() || '';
        const basicRate = parseFloat(row['basic rate']) || 0;
        const gst = parseFloat(row['gst']) || 0;
        const ratesWithGst = parseFloat(row['rates with gst']) || basicRate;
        const unitStr = row['Unit']?.trim() || 'Each';
        const hsn = row['HSN']?.trim() || '';

        // Parse unit
        const { unit, value } = parseUnit(unitStr);

        // Calculate final price (use rates with GST if available, otherwise basic rate + GST)
        const finalPrice = ratesWithGst > 0 ? ratesWithGst : basicRate * (1 + gst / 100);

        // Create variant label
        const variantLabel = specification 
          ? `${specification}` 
          : `${value}${unit}`;

        const product: ProcessedProduct = {
          title,
          slug: generateSlug(title),
          description: specification 
            ? `${title} - ${specification}` 
            : title,
          base_price: finalPrice,
          variants: [{
            label: variantLabel,
            unit: unit as any,
            value,
            price: finalPrice,
            stock: 100, // Default stock
            images: []
          }],
          is_in_stock: true,
          is_featured: false,
          categories: ['Cleaning'], // Default category
          category_ids: [],
          images: [],
          tags: [],
          min_order_quantity: 1,
          hsn,
          gst
        };

        products.push(product);
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
      }
    });

    return products;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setPreview([]);
      setShowPreview(false);

      // Parse and preview
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processed = processCSV(results.data as CSVRow[]);
          setPreview(processed);
        },
        error: (error) => {
          alert(`Error parsing CSV: ${error.message}`);
        }
      });
    }
  };

  const handleImport = async () => {
    if (!file || preview.length === 0) {
      alert('Please select a valid CSV file first');
      return;
    }

    setImporting(true);
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    try {
      // Import products one by one
      for (let i = 0; i < preview.length; i++) {
        const product = preview[i];
        try {
          const formData = new FormData();
          
          // Add all product fields
          Object.entries(product).forEach(([key, value]) => {
            if (key === 'variants') {
              formData.append('variants', JSON.stringify(value));
            } else if (Array.isArray(value)) {
              value.forEach(item => formData.append(`${key}[]`, String(item)));
            } else if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });

          await axios.post('/api/admin/products', formData);
          successCount++;
        } catch (error: any) {
          failedCount++;
          errors.push(`Row ${i + 1} (${product.title}): ${error.response?.data?.message || error.message}`);
        }
      }

      setResult({
        success: successCount,
        failed: failedCount,
        errors
      });

      if (successCount > 0) {
        onSuccess();
      }
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `S.No.,Product name,Specification,basic rate,gst,rates with gst,Unit,HSN
1,Kentucky wet mop full unit,,180,18,212.4,Each,
2,Kentucky wet mop frill,,57,18,67.26,Each,
3,Dry mop full unit white,,300,18,354,Each,
4,Cotton mop 18" w/o bamboo,Heavy,65,18,76.7,Each,
5,Floor Duster,Fine quality,120,5,126,Doz,`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Import Products from CSV
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-2">CSV Format Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Required columns: Product name, basic rate, gst, Unit</li>
                  <li>Optional columns: Specification, rates with gst, HSN, S.No.</li>
                  <li>Supported units: Each, Doz (Dozen), Pcs</li>
                  <li>GST should be in percentage (e.g., 18 for 18%)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Download Template */}
          <div>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Download Template CSV</span>
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
              className="block w-full text-sm text-slate-500 dark:text-slate-400
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300
                dark:hover:file:bg-blue-800
                cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  Preview ({preview.length} products)
                </h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
              
              {showPreview && (
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {preview.slice(0, 10).map((product, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {product.title}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 mt-1">
                          Price: ₹{product.base_price} | Variant: {product.variants[0].label}
                          {product.hsn && ` | HSN: ${product.hsn}`}
                          {product.gst && ` | GST: ${product.gst}%`}
                        </div>
                      </div>
                    ))}
                    {preview.length > 10 && (
                      <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        ... and {preview.length - 10} more products
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Import Result */}
          {result && (
            <div className={`border rounded-lg p-4 ${
              result.failed === 0 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
            }`}>
              <div className="flex items-start space-x-3">
                {result.failed === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Import Complete
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Successfully imported: {result.success} products
                  </p>
                  {result.failed > 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Failed: {result.failed} products
                    </p>
                  )}
                  
                  {result.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer">
                        Show Errors ({result.errors.length})
                      </summary>
                      <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                        {result.errors.map((error, index) => (
                          <div key={index} className="text-xs text-red-600 dark:text-red-400">
                            {error}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleImport}
              disabled={!file || preview.length === 0 || importing}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {importing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import Products</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={importing}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {result ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}