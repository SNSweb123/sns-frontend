import React from 'react';
import './ProductCard.css';
import { useCart } from '../pages/CartContext';
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ product, onBuy }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();


const isAlreadyInCart =
  product?.type === "subscription"
    ? cartItems?.some(item => item?._id === product?._id)
    : false;

  const isOutOfStock =
    product?.couponStats?.available === 0;

const handleClick = () => {
  if (isAlreadyInCart || isOutOfStock) return;

  addToCart(product);
  navigate('/checkout');
};


  return (
 <div 
  className="product-card" 
  style={{ 
    background: product.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff'
  }}
>
<div className="product-image-top">
 <img src={product?.icon || "https://via.placeholder.com/150"} alt={product?.name || "product"} />
</div>
    
      
      <div className="card-body">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-subtitle">{product.subtitle}</p>
        {product.type === "gift-voucher" ? (
  <p style={{ color: "#fff", fontWeight: "bold",fontSize:"18px" }}>
    🎁 Gift Voucher
  </p>
) : (
  <p style={{ color: "#fff", fontWeight: "bold",fontSize:"18px" }}>
    📺 Subscription
  </p>
)}
        
        <div className="product-details">
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{product.type}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Validity:</span>
            <span className="detail-value">{product.validity}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Delivery:</span>
            <span className="detail-value">{product.delivery}</span>
          </div>
        </div>
        
        <div className="pricing">
          <div className="price-row">
            <span className="original-price">₹{product.originalPrice}</span>
            <span className="discount-badge">{product.discountPercent}% OFF</span>
          </div>
          <div className="discounted-price">₹{product.discountedPrice}</div>
        </div>
      
      </div>

    <div className="card-actions">
  <button
    className="add-cart-btn"
    onClick={() => addToCart(product)}
    disabled={isAlreadyInCart || isOutOfStock}
  >
    {isOutOfStock
      ? "Out of Stock"
      : isAlreadyInCart
      ? "Already Added"
      : "Add to Cart"}
  </button>

  <button 
    className={`buy-button ${
      isAlreadyInCart || isOutOfStock ? 'disabled' : ''
    }`}
    onClick={handleClick}
    disabled={isAlreadyInCart || isOutOfStock}
  >
    {isOutOfStock
      ? "Out of Stock"
      : isAlreadyInCart
      ? "Already Added"
      : "Buy Now"}
  </button>
</div>
    </div>
  );
};

export default ProductCard;


