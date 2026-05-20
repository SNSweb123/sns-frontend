import React, { useState, useEffect } from 'react';
import { BASE_URL } from "../config";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { AiOutlineHome } from "react-icons/ai";
import './Checkout.css';
import axios from 'axios';
import Swal from 'sweetalert2';




function Checkout() {
  const navigate = useNavigate();

  const [showTerms, setShowTerms] = useState(false);
 
const { cartItems, removeFromCart,clearCart, increaseQuantity,decreaseQuantity } = useCart();
const isCartEmpty = !cartItems || cartItems.length === 0;
 
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);


const handlePayNow = async () => {
  setIsPlacingOrder(true);

  // ✅ Name validation
  if (!/^[a-zA-Z\s]{3,}$/.test(formData.fullName)) {
    setIsPlacingOrder(false);
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Name',
      text: 'Name should contain only letters and at least 3 characters.',
    });
    return;
  }

  // ✅ Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setIsPlacingOrder(false);
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Email',
      text: 'Please enter a valid email address.',
    });
    return;
  }

  if (/(test|fake|temp|demo|abcd|xyz)@/i.test(formData.email)) {
    setIsPlacingOrder(false);
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Email',
      text: 'Please use a real email address.',
    });
    return;
  }

  // ✅ Phone validation
  if (!/^\d{10}$/.test(formData.phone)) {
    setIsPlacingOrder(false);
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Phone',
      text: 'Phone number must be exactly 10 digits.',
    });
    return;
  }

  if (
    formData.phone === "1234567890" ||
    formData.phone === "0000000000" ||
    /^(\d)\1{9}$/.test(formData.phone)
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Phone',
      text: 'Please enter a valid phone number.',
    });
    return;
  }

  // ⚠️ warning popup
  const result = await Swal.fire({
    icon: 'info',
    title: 'Important Payment Notice',
    html: `
      Please complete payment using <b>UPI/Card</b>.<br/><br/>
      Do not close window during payment.
    `,
    confirmButtonText: 'Proceed to Pay',
  });

 if (!result.isConfirmed) {
  setIsPlacingOrder(false);
  return;
}

  // 🚀 RAZORPAY START
 const res = await loadRazorpay();

if (!res || !window.Razorpay) {
  setIsPlacingOrder(false);

  Swal.fire({
    icon: "error",
    title: "Payment system failed to load"
  });

  return;
}
  const amount = calculateTotal();

  // 1️⃣ create order from backend
const { data } = await axios.post(
  `${BASE_URL}/api/payment/create-order`,
  {
    amount
  }
);

const options = {
  key: "rzp_live_SqsJZi3OpN5aKO",
  amount: data.amount,
  currency: "INR",
  name: "Your Store",
  order_id: data.id,

  modal: {
    ondismiss: function () {

      setIsPlacingOrder(false);

      Swal.fire({
        icon: "info",
        title: "Payment Cancelled",
        text: "You closed the payment window."
      });
    }
  },


 handler: async function (response) {

  try {

    // ✅ payment verify + order save
const verifyRes = await axios.post(
  `${BASE_URL}/api/payment/verify`,
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,

        cartItems,
        formData
      }
    );

    console.log(verifyRes.data);

    // ✅ Gift voucher codes
const deliveredCodes =
  verifyRes.data.deliveredCodes || [];

const orderId = verifyRes.data.orderId;

// check products
const hasGiftVoucher =
  deliveredCodes.length > 0;

const hasSubscription =
  cartItems.some(
    item => item.type === "subscription"
  );

// =========================
// 🎁 GIFT VOUCHER FLOW
// =========================
if (hasGiftVoucher) {

  const codesHtml = deliveredCodes
    .map(
      (item, index) => `
        <div
          style="
            margin-bottom:20px;
            padding:15px;
            border:1px solid #ddd;
            border-radius:12px;
            background:#f8f9fa;
          "
        >
          <div
            style="
              font-weight:bold;
              margin-bottom:8px;
              color:#333;
            "
          >
            ${index + 1}. ${item.productName}
          </div>

        <div
  style="
    display:flex;
    gap:10px;
    align-items:center;
    flex-wrap:wrap;
  "
>
            <input
    id="code-${index}"
    value="${item.code}"
    readonly
    style="
      flex:1;
      min-width:0;
      padding:10px;
      border-radius:8px;
      border:1px solid #ccc;
      font-weight:bold;
      text-align:center;
      background:white;
    "
  />

            <button
    onclick="
      navigator.clipboard.writeText('${item.code}');
      this.innerText='Copied!';
    "
    style="
      padding:10px 14px;
      min-width:90px;
      border:none;
      background:#28a745;
      color:white;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
    "
  >
    Copy
  </button>
          </div>
        </div>
      `
    )
    .join("");

  await Swal.fire({
    icon: "success",
    title: "Gift Voucher Delivered 🎁",
    width: 650,
    html: `
      <div style="text-align:left;">

        <p>
          <b>Order ID:</b><br/>
          ${orderId}
        </p>

        <p style="margin-top:15px;">
          Your voucher codes:
        </p>

        ${codesHtml}

      </div>
    `,
  });
}

// =========================
// 📺 SUBSCRIPTION FLOW
// =========================
if (hasSubscription) {

  await Swal.fire({
    icon: "success",
    title: "Subscription Activated 📺",
    html: `
      <div style="line-height:1.8;">
        <p>
          Payment successful.
        </p>

        <p>
          Your subscription will be activated within
          <b>24 hours</b>.
        </p>

        <p>
          Order ID:
          <br/>
          <b>${orderId}</b>
        </p>
      </div>
    `,
  });
}

clearCart();

navigate("/");

  } catch (err) {

  console.log(
    "FRONTEND ERROR:",
    err.response?.data
  );

  Swal.fire({
    icon: "error",
    title: "Payment Verification Failed",
    text:
      err.response?.data?.error ||
      err.message
  });
}
},

  theme: {
    color: "#3399cc"
  }
};

const rzp = new window.Razorpay(options);
rzp.open();
}



const calculateTotal = () => {
  return cartItems.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  );
};

const totalAmount = calculateTotal();



  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    promoCode: '',
  });
 

 

  // ⏳ Timer countdown
useEffect(() => {
  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

// 🚨 Time-up alert + redirect
useEffect(() => {
  if (timer === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Time is Up!',
      text: 'Your offer hold has expired. Please place the order again.',
      confirmButtonText: 'Go to Home',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      navigate('/'); // redirect to home
    });
  }
}, [timer, navigate]);


  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

 const handleInputChange = (e) => {
  const { name, value } = e.target;

  // ✅ Name: allow only letters + space
  if (name === "fullName") {
    if (!/^[a-zA-Z\s]*$/.test(value)) return;
  }

  // ✅ Phone: allow only digits, max 10
  if (name === "phone") {
    if (!/^\d{0,10}$/.test(value)) return;
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};
 
 
  const calculateUSDT = (amount) => {
    return (amount / 83).toFixed(2); // Approximate conversion rate
  };

  const usdtAmount = calculateUSDT(totalAmount);

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};
  if (isCartEmpty) {
  return (
   <div className="empty-cart">
  <div className="empty-cart-content">
    <div className="empty-cart-icon">🛒</div>
    <h2>Your cart is empty</h2>
    <p>Add some amazing products and start your checkout journey.</p>
    <button onClick={() => navigate('/')}>
      Continue Shopping
    </button>
  </div>
</div>
  );
}
return (
    <div className="checkout-page">
     <div className="offer-banner">
  <span className="offer-icon">⚡</span>
  {timer > 0 ? (
    <>
      <span>
        Offer Hold Ends in{' '}
        <strong className="timer-red">{formatTimer(timer)}</strong>
      </span>
      <span>Complete your payment now to secure this price!</span>
    </>
  ) : (
    <span className="timer-red">Offer Expired</span>
  )}
</div>


      <div className="checkout-container">
      <div className="back-to-cart">
       
        <button onClick={() => navigate(-1)} className="back-link" style={{ marginLeft: "10px" }}>
           <AiOutlineHome style={{ marginRight: "5px" }} />
          ← Back to Home
        </button>
      </div>
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-left">
            <h2 className="payment-title">Total Amount</h2>


            <div className="payment-amount">
              <div className="amount-inr">₹{totalAmount.toLocaleString('en-IN')}</div>
              <div className="amount-usdt">${usdtAmount} USDT</div>
            </div>
    
    
           <div className="instructions-box">

  <div className="instructions-header">
    ⚡ Quick Payment Instructions
  </div>

  <ol>

    <li>
      📱 Scan the QR code or use the provided UPI ID
    </li>

    <li>
      💳 Pay 
      <strong>
        ₹{totalAmount.toLocaleString('en-IN')}
      </strong>
      using any UPI app
    </li>

    <li>
      📝 Fill your correct details below carefully
    </li>

    <li>
      🔒 Do not close the payment window during transaction
    </li>

    <li>
      ⚡ Gift voucher codes are delivered instantly after successful payment
    </li>

    <li>
      📺 Subscription activation may take up to 24 hours
    </li>

    <li>
      📧 Keep your payment transaction ID safe for support
    </li>

  </ol>

  <div className="secure-note">
    🔐 100% Secure Payment • Instant Verification • Trusted Checkout
  </div>

</div>
          </div>



          <div className="checkout-right">
            <div className="your-details">
              <h3>Your Details</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                 <input
  type="text"
  name="fullName"
  placeholder="Enter your name"
  value={formData.fullName}
  onChange={handleInputChange}
  pattern="[A-Za-z\s]{3,}"
  title="Only letters allowed (min 3 characters)"
  required
/>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                 <input
  type="email"
  name="email"
  placeholder="Enter your email"
  value={formData.email}
  onChange={handleInputChange}
  required
/>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                 <input
  type="tel"
  name="phone"
  placeholder="Enter 10 digit phone number"
  value={formData.phone}
  onChange={handleInputChange}
  maxLength="10"
  pattern="\d{10}"
  title="Enter a valid 10-digit number"
  required
/>
                </div>

               
               
                <div className="order-summary">
                  <h3>Order Summary</h3>
                {cartItems.length === 0 ? (
  <p>Your cart is empty</p>
) : (
  cartItems.map((item) => (
    <div key={item._id} className="order-item">
      <div className="item-info">
        <div className="item-name">
          {item.name} - {item.type}
        </div>
        <div className="item-price-unit">
          ₹{item.discountedPrice} each
        </div>
      </div>

      <div className="item-controls">
        <div className="quantity-control">

  {item.type === "subscription" ? (
    <>
      <button disabled className="qty-btn">
        -
      </button>

      <span className="qty-value">
        1
      </span>

      <button disabled className="qty-btn">
        +
      </button>

      <p
        style={{
          fontSize: "12px",
          color: "gray"
        }}
      >
        Only 1 subscription allowed
      </p>
    </>
  ) : (
    <>
      <button
        type="button"
        className="qty-btn"
        onClick={() =>
          decreaseQuantity(item._id)
        }
      >
        -
      </button>

      <span className="qty-value">
        {item.quantity}
      </span>

      <button
        type="button"
        className="qty-btn"
        onClick={() =>
          increaseQuantity(item._id)
        }
      >
        +
      </button>

      <p
        style={{
          fontSize: "12px",
          color: "gray"
        }}
      >
        Quantity can be changed
      </p>
    </>
  )}

</div>

        <div className="item-total">
          ₹{item.discountedPrice * item.quantity}
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item._id)}
          className="delete-btn"
        >
          🗑️
        </button>
      </div>
    </div>
  ))
)}
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.reduce((t, i) => t + i.quantity, 0)} items)</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="summary-row usdt-row">
                    <span>USDT</span>
                    <span>${usdtAmount} USDT</span>
                  </div>


                 <button
  type="button"
  className="pay-now-btn"
  onClick={handlePayNow}
  disabled={timer === 0 || isPlacingOrder}
>
  {isPlacingOrder ? "Processing..." : "Pay Now"}
</button>

                </div>
<div className="terms-box">

  <div
    className="terms-header"
    onClick={() =>
      setShowTerms(!showTerms)
    }
  >
    <span>
      📜 Terms & Conditions
    </span>

    <span className={`arrow ${showTerms ? "open" : ""}`}>
      ▼
    </span>
  </div>

  {showTerms && (

    <div className="terms-content">

      <ul>

        <li>
          ✅ All payments are processed securely through trusted payment gateways.
        </li>

        <li>
          ✅ Subscription activation may take up to 24 hours after successful payment verification.
        </li>

        <li>
          ✅ Gift voucher codes are delivered instantly after successful payment verification.
        </li>

        <li>
          ✅ Customers must provide valid email and phone details during checkout.
        </li>

        <li>
          ✅ Orders with suspicious or fraudulent activity may be cancelled without notice.
        </li>

        <li>
          ✅ Sharing, reselling or misuse of subscription accounts is strictly prohibited.
        </li>

        <li>
          ✅ Customers are responsible for entering the correct payment and account details.
        </li>

        <li>
          ❌ No refund will be provided after successful delivery of subscription or gift voucher codes.
        </li>

        <li>
          ❌ Refunds are not applicable for incorrect email, phone number or user mistakes.
        </li>

        <li>
          ⚠️ Service availability may depend on third-party platform policies and regional restrictions.
        </li>

      </ul>

    </div>

  )}

</div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

