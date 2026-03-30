import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = ["Digital Art", "Software", "Music", "Writing", "Consulting", "Other"];

const DEFAULT_WALLET = "GodWorldFreePay1111111111111111111111111111";

const ProductCard = ({ product, onGenerateQR, onDelete }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-2">
      <div>
        <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        <h3 className="text-white font-bold text-lg mt-2">{product.name}</h3>
      </div>
      <div className="text-right">
        <div className="text-purple-400 font-bold text-xl">{product.price_sol} SOL</div>
        <div
          className={`text-xs mt-1 ${
            product.available ? "text-green-400" : "text-gray-500"
          }`}
        >
          {product.available ? "● Available" : "○ Unavailable"}
        </div>
      </div>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed flex-1">{product.description}</p>
    <div className="flex gap-2 mt-auto">
      <button
        onClick={() => onGenerateQR(product)}
        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
      >
        📱 Generate QR
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="bg-gray-700 hover:bg-red-900/50 hover:border-red-700 border border-gray-600 text-gray-400 hover:text-red-400 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
      >
        🗑
      </button>
    </div>
  </div>
);

const QRModal = ({ payment, onClose }) => {
  if (!payment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-purple-700 rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 shadow-2xl">
        <h2 className="text-white font-bold text-xl">Scan to Pay</h2>
        <p className="text-gray-400 text-sm text-center">
          {payment.label} — <span className="text-purple-400 font-bold">{payment.amount_sol} SOL</span>
        </p>
        <div className="bg-white p-3 rounded-xl">
          <img
            src={payment.qr_image_url}
            alt="Solana Pay QR Code"
            className="w-48 h-48"
          />
        </div>
        <p className="text-gray-500 text-xs text-center break-all max-w-xs">
          {payment.solana_pay_url}
        </p>
        <p className="text-gray-500 text-xs text-center">
          Open with Phantom or Solflare wallet to complete payment
        </p>
        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const QRStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeQR, setActiveQR] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_sol: "",
    category: CATEGORIES[0],
    available: true,
  });
  const [recipientAddress, setRecipientAddress] = useState(DEFAULT_WALLET);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await axios.post(`${API}/products`, {
        ...form,
        price_sol: parseFloat(form.price_sol),
      });
      setForm({ name: "", description: "", price_sol: "", category: CATEGORIES[0], available: true });
      setShowForm(false);
      fetchProducts();
    } catch {
      setError("Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API}/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      setError("Failed to delete product.");
    }
  };

  const handleGenerateQR = async (product) => {
    try {
      const res = await axios.post(`${API}/payment/generate-qr`, {
        recipient: recipientAddress,
        amount_sol: product.price_sol,
        label: product.name,
        message: product.description,
      });
      setActiveQR(res.data);
    } catch {
      setError("Failed to generate QR code.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <QRModal payment={activeQR} onClose={() => setActiveQR(null)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">🛒 QR Free Store</h1>
            <p className="text-gray-400 mt-1">
              List your products and generate Solana Pay QR codes
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {showForm ? "✕ Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Wallet Address */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-6">
          <label className="text-gray-400 text-sm font-medium block mb-1">
            Your Solana Wallet Address (payment recipient)
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter your Solana wallet address"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Add Product Form */}
        {showForm && (
          <form
            onSubmit={handleAddProduct}
            className="bg-gray-800 border border-purple-900/40 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-white font-bold text-lg mb-4">New Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Product Name *</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Blue Star v2026 License"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Price (SOL) *</label>
                <input
                  required
                  name="price_sol"
                  type="number"
                  min="0"
                  step="any"
                  value={form.price_sol}
                  onChange={handleChange}
                  placeholder="e.g. 0.1"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="available" className="text-gray-400 text-sm">
                  Available for purchase
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="text-gray-400 text-sm block mb-1">Description *</label>
                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe what you're offering..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                {submitting ? "Adding..." : "Add to Store"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && !showForm && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-400 text-lg">No products yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Add your first product to start accepting payments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onGenerateQR={handleGenerateQR}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRStore;
