import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './AdminPanel.css';
import Swal from 'sweetalert2';
import TransactionHistory from './TransactionHistory';
import { BASE_URL } from "../config";


function AdminPanel() {

const ADMIN_KEY =
  import.meta.env.VITE_ADMIN_SECRET;

  const [activeTab, setActiveTab] = useState('products'); 
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '',
    type: '',
    validity: '',
    delivery: '',
    originalPrice: '',
    discountedPrice: '',
    discountPercent: '',
    availableCodes: '',
    icon: '',
    gradient: '',
    couponCodes: []

  });
 

  useEffect(() => {
    fetchProducts();
  }, []);

  

  const fetchProducts = async () => {
  try {
  const response = await axios.get(`${BASE_URL}/api/products?ts=${Date.now()}`)
    setProducts(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};


 const handleInputChange = (e) => {
  const { name, value } = e.target;

  let updatedProduct = {
    ...newProduct,
    [name]: value
  };

  // ✅ AUTO CALCULATE DISCOUNTED PRICE
  const price = Number(updatedProduct.originalPrice);
  const discount = Number(updatedProduct.discountPercent);

  if (price && discount) {
    const discounted = price - (price * discount / 100);
    updatedProduct.discountedPrice = Math.round(discounted);
  }

  setNewProduct(updatedProduct);
};

const handleSubmit = async (e) => {
  e.preventDefault();



  const payload = {
    ...newProduct,
    originalPrice: Number(newProduct.originalPrice),
    discountedPrice: Number(newProduct.discountedPrice),
    discountPercent: Number(newProduct.discountPercent),
  };

  try {

    if (editMode) {
      // 🔥 UPDATE PRODUCT
  await axios.put(
  `${BASE_URL}/api/products/${editingId}`,
  payload,
  {
    headers: {
      "x-admin-key": ADMIN_KEY
    }
  }
);

      Swal.fire({
        icon: 'success',
        title: 'Product Updated',
        timer: 1500,
        showConfirmButton: false,
      });

      setEditMode(false);
      setEditingId(null);

    } else {
      // 🔥 CREATE PRODUCT
await axios.post(
  `${BASE_URL}/api/products`,
  payload,
  {
    headers: {
      "x-admin-key": ADMIN_KEY
    }
  }
);

      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        timer: 1500,
        showConfirmButton: false,
      });
    }

    // reset form
    setNewProduct({
      name: '',
      subtitle: '',
      type: '',
      validity: '',
      delivery: '',
      originalPrice: '',
      discountedPrice: '',
      discountPercent: '',
      icon: '',
      gradient: '',
      couponCodes: []
    });

    fetchProducts();

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong!',
    });
  }
};





 const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This product will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!result.isConfirmed) return;

  try {
await axios.delete(
  `${BASE_URL}/api/products/${id}`,
  {
    headers: {
      "x-admin-key": ADMIN_KEY
    }
  }
);

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Product deleted successfully.',
      timer: 1500,
      showConfirmButton: false,
    });

    fetchProducts();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete product.',
    });
  }
};



const handleEdit = (product) => {
  setNewProduct(product);   // form me data fill ho jayega
  setEditingId(product._id);
  setEditMode(true);
};



const GRADIENT_OPTIONS = [
  { label: 'Purple → Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'Sunset Orange', value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },
  { label: 'Minty Green', value: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)' },
  { label: 'Pink → Purple', value: 'linear-gradient(135deg, #ff6a95 0%, #a18cd1 100%)' },
  { label: 'Blue → Cyan', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
   { label: 'Sunset Pink → Yellow', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { label: 'Teal → Blue', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { label: 'Red → Orange', value: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)' },
  { label: 'Violet → Pink', value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
  { label: 'Orange → Yellow', value: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
  { label: 'Green → Lime', value: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' },
  { label: 'Purple → Cyan', value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
  { label: 'Pink → Orange', value: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
  { label: 'Sky Blue → Blue', value: 'linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)' },
  { label: 'Sunrise', value: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)' }
];

const handleLogout = () => {
  localStorage.removeItem('isAdmin');
  window.location.href = '/'; // redirect to home
};


const [openCoupons, setOpenCoupons] = useState(null);
const [editMode, setEditMode] = useState(false);
const [editingId, setEditingId] = useState(null);



  return (
    <div className="admin-panel">
           <button onClick={handleLogout} className="logout-btn">Logout</button>
           <div style={{ marginBottom: '20px' }}>
 <div className="admin-tabs">
  <button
    className={`admin-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
    onClick={() => setActiveTab('transactions')}
  >
    📄 Transaction / Order History
  </button>

  <button
    className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
    onClick={() => setActiveTab('products')}
  >
    🛒 Product Management
  </button>
</div>

</div>

     <h1 className="admin-title">
  Admin Panel - {activeTab === 'products' ? 'Product Management' : 'Transaction / Order History'}
</h1>

      <div className="admin-content">
        <div className="form-preview-container">
          <div className="product-form">
           <h2>Create New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
  <input
  type="file"
  accept="image/*"
onChange={async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
const res = await fetch(
  `${BASE_URL}/api/upload`,
  {
    method: "POST",
    headers: {
      "x-admin-key": ADMIN_KEY
    },
    body: formData,
  }
);

const data = await res.json();

  console.log("UPLOAD RESPONSE:", data); // IMPORTANT CHECK

  setNewProduct(prev => ({
    ...prev,
    icon: data.url,
  }));
}}
/>
</div>
              <div className="form-row">
                <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required />
             </div>
              <input type="text" name="subtitle" placeholder="Subtitle" value={newProduct.subtitle} onChange={handleInputChange} />
              <div className="form-row">
                <select name="type" value={newProduct.type} onChange={handleInputChange} required>
  <option value="">Select Type</option>
  <option value="subscription">Subscription</option>
  <option value="gift-voucher">Gift Voucher</option>
</select>
                <input type="text" name="validity" placeholder="Validity" value={newProduct.validity} onChange={handleInputChange} />
              </div>
              <input type="text" name="delivery" placeholder="Delivery" value={newProduct.delivery} onChange={handleInputChange} />
              <div className="form-row">
                <input type="number" name="originalPrice" placeholder="Original Price" value={newProduct.originalPrice} onChange={handleInputChange} />
                <input
  type="number"
  name="discountedPrice"
  placeholder="Discounted Price"
  value={newProduct.discountedPrice}
  readOnly
/>
 <input type="number" name="discountPercent" placeholder="Discount %" value={newProduct.discountPercent} onChange={handleInputChange} />
              </div>
              <div className="form-row">   
                {newProduct.type === "gift-voucher" && (
  
    <div className="coupon-input-box">

  <label className="coupon-label">
    Enter Coupon Codes
  </label>

  <textarea
    className="coupon-textarea"
    placeholder="Example:
ABC123, XYZ789, OFFER50, SAVE20..."
    value={newProduct.couponCodes.map(c => c.code).join(",")}
    onChange={(e) => {
      setNewProduct({
        ...newProduct,
        couponCodes: e.target.value
          .split(",")
          .map(code => ({
            code: code.trim(),
            isUsed: false
          }))
      });
    }}
  />

  <p className="coupon-helper">
    Tip: You can add unlimited codes separated by comma
  </p>

</div>
)}
              </div>
              <select
  name="gradient"
  value={newProduct.gradient}
  onChange={handleInputChange}
  style={{ background: newProduct.gradient, color: '#090009' }}
>
  <option value="">Select Gradient</option>
  {GRADIENT_OPTIONS.map((g) => (
    <option key={g.value} value={g.value}>
      {g.label}
    </option>
  ))}
</select>


             <button type="submit" className="upload-btn">
  {editMode ? "Update Product" : "Upload Product"}
</button>
            
               </form>
               {editMode && (
  <button
    type="button"
    onClick={() => {
      setEditMode(false);
      setEditingId(null);
      setNewProduct({
        name: '',
        subtitle: '',
        type: '',
        validity: '',
        delivery: '',
        originalPrice: '',
        discountedPrice: '',
        discountPercent: '',
        availableCodes: '',
        icon: '',
        gradient: '',
        couponCodes: []
      });
    }}
  >
    Cancel Edit
  </button>
)}
          </div>

          <div className="preview-section">
            <h3>Live Preview</h3>
            <div className="preview-container">
            <ProductCard
  product={{
    ...newProduct,
    availableCodes: Number(newProduct.availableCodes) || 0,
    originalPrice: Number(newProduct.originalPrice) || 0,
    discountedPrice: Number(newProduct.discountedPrice) || 0,
    discountPercent: Number(newProduct.discountPercent) || 0,
  }}
/>

            </div>
            <div className="preview-controls">
              <p><strong>Customization Tips:</strong></p>
              <ul>
                <li>Upload product image only</li>
                <li>Gradient examples: <code>linear-gradient(135deg, #667eea 0%, #764ba2 100%)</code></li>
                <li>Prices are in INR (₹)</li>
                <li>All fields are required for the product to display properly</li>
              </ul>
            </div>
          </div>
        </div>
 
     
     {activeTab === 'products' && (
        <div className="product-list">
          <h2>Existing Products ({products.length})</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-item">

  {/* TOP SECTION */}
  <div className="product-top">

    <div className="product-info">
      <h3>{product.name}</h3>

      <p className="product-subtitle">
        {product.subtitle}
      </p>

      <div className="coupon-box">
        <strong>Coupons</strong>

        <div className="coupon-stats">
          <span>Total: {product.couponStats?.total || 0}</span>
          <span>Used: {product.couponStats?.used || 0}</span>
          <span>Available: {product.couponStats?.available || 0}</span>
        </div>
      </div>
    </div>

    {product.icon && (
      <img
        src={product.icon}
        alt={product.name}
        className="product-thumb"
      />
    )}
  </div>

  {/* DETAILS */}
  <div className="product-meta">

    <div className="meta-row">
      <span>Price</span>
      <strong>
        ₹{product.discountedPrice}
      </strong>
    </div>

    <div className="meta-row">
      <span>Original</span>
      <strong>
        ₹{product.originalPrice}
      </strong>
    </div>

    <div className="meta-row">
      <span>Discount</span>
      <strong>
        {product.discountPercent}%
      </strong>
    </div>

    <div className="meta-row">
      <span>Type</span>
      <strong>
        {product.type}
      </strong>
    </div>

    <div className="meta-row">
      <span>Validity</span>
      <strong>
        {product.validity}
      </strong>
    </div>

  </div>


  {/* COUPON LIST */}

{product.type === "gift-voucher" && (
  <div className="coupon-section">

    <button
      className="toggle-coupons-btn"
      onClick={() =>
        setOpenCoupons(
          openCoupons === product._id ? null : product._id
        )
      }
    >
      {openCoupons === product._id
        ? "Hide Active Codes"
        : `View Active Codes (${
            product.couponCodes?.filter(c => !c.isUsed).length || 0
          })`}
    </button>

    {openCoupons === product._id && (
      <div className="coupon-list">

        {product.couponCodes
          ?.filter(c => !c.isUsed)
          .map((c, i) => (
            <div key={i} className="coupon-item">

              <span className="coupon-code">
                🟢 {c.code}
              </span>

              <button
                className="delete-coupon-btn"
                onClick={async () => {
               await axios.put(
  `${BASE_URL}/api/products/${product._id}/coupon/delete`,
  { code: c.code },
  {
    headers: {
      "x-admin-key": ADMIN_KEY
    }
  }
);

                  fetchProducts();
                }}
              >
                Delete
              </button>

            </div>
          ))}

      </div>
    )}

  </div>
)}

 
  {/* FOOTER ACTIONS */}
  <div className="product-footer">

    <div className="status-badge">
      🟢 Active
    </div>

    <div className="product-actions">

      <button
        className="edit-btn"
        onClick={() => handleEdit(product)}
      >
        Edit
      </button>

      <button
        className="delete-btn2"
        onClick={() => handleDelete(product._id)}
      >
        Delete
      </button>

    </div>

  </div>

</div>
            
            ))}
          </div>
        </div>
)}
{activeTab === 'transactions' && (
  <TransactionHistory />
)}
      </div>
    </div>
  );
}

export default AdminPanel;