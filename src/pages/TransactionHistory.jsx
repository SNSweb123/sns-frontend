import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

function TransactionHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 search + pagination state
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState("all");
  const itemsPerPage = 8;

  const BASE_URL = "https://sns-backend-seven.vercel.app";
  useEffect(() => {
    const fetchOrders = async () => {
      try {
         const res = await axios.get(`${BASE_URL}/api/orders`);
        setOrders(res.data);
          console.log("ORDER DATA:", res.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);




  const filteredOrders = orders.filter((order) => {

  // 🔍 Search Filter
  const matchesSearch =
    `${order.fullName} ${order.email} ${order.orderId} ${
      order.items?.map(i => i.productName).join(' ')
    } ${order.transactionId}`
      .toLowerCase()
      .includes(search.toLowerCase());

  // 🎯 Type Filter
  const matchesType =
    orderFilter === "all"
      ? true
      : order.items?.some(
          item => item.productType === orderFilter
        );

  return matchesSearch && matchesType;
});


  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

   // ✅ Subscription Orders
const subscriptionOrders = filteredOrders.filter(order =>
  order.items?.some(
    item => item.productType === "subscription"
  )
);

// ✅ Gift Voucher Orders
const voucherOrders = filteredOrders.filter(order =>
  order.items?.some(
    item => item.productType === "gift-voucher"
  )
);


  return (
    <div className="transaction-wrapper">
      <h2 className="transaction-title">📄 Transaction / Order History</h2>

    
    <div className="order-filter-tabs">

  <button
    className={orderFilter === "all" ? "active-filter" : ""}
    onClick={() => {
      setOrderFilter("all");
      setCurrentPage(1);
    }}
  >
    All Orders
  </button>

  <button
    className={orderFilter === "subscription" ? "active-filter" : ""}
    onClick={() => {
      setOrderFilter("subscription");
      setCurrentPage(1);
    }}
  >
    🛒 Subscription
  </button>

  <button
    className={orderFilter === "gift-voucher" ? "active-filter" : ""}
    onClick={() => {
      setOrderFilter("gift-voucher");
      setCurrentPage(1);
    }}
  >
    🎁 Gift Voucher
  </button>

</div>



      {/* 🔍 Search */}
      <input
        type="text"
        className="transaction-search"
        placeholder="Search by name, email, product or transaction ID..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

     {loading ? (
  <div className="transaction-loading">
    Loading orders...
  </div>

) : currentOrders.length === 0 ? (

  <div className="transaction-empty">
    No orders found
  </div>

) : (

  <>

    {/* ================= SUBSCRIPTION TABLE ================= */}

    <h3 className="table-heading">
      🛒 Subscription Orders ({subscriptionOrders.length})
    </h3>

    <div className="transaction-table-container">

      <table className="transaction-table">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Products</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {subscriptionOrders.map((order, index) => (

            <tr key={order._id}>

              <td>{index + 1}</td>

              <td>{order.orderId}</td>

              <td>{order.fullName}</td>

              <td>{order.email}</td>

              <td>
                {order.items
                  ?.filter(
                    item =>
                      item.productType === "subscription"
                  )
                  .map((item, i) => (
                  <div key={i} className="product-line">

  <span className={
    item.productType === "subscription"
      ? "subscription-badge"
      : "voucher-badge"
  }>
    {item.productType === "subscription"
      ? "SUB"
      : "CODE"}
  </span>

  {item.productName}

</div>
                  ))}
              </td>

              <td>
                {order.items
                  ?.filter(
                    item =>
                      item.productType === "subscription"
                  )
                  .map((item, i) => (
                    <div key={i}>
                      {item.quantity}
                    </div>
                  ))}
              </td>

              <td>
                ₹{order.totalPriceINR.toLocaleString('en-IN')}
              </td>

              <td>
                {new Date(order.createdAt).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>


    {/* ================= VOUCHER TABLE ================= */}

    <h3 className="table-heading">
      🎁 Gift Voucher Orders ({voucherOrders.length})
    </h3>

    <div className="transaction-table-container">

      <table className="transaction-table">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Voucher Products</th>
            <th>Delivered Codes</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {voucherOrders.map((order, index) => (

            <tr key={order._id}>

              <td>{index + 1}</td>

              <td>{order.orderId}</td>

              <td>{order.fullName}</td>

              <td>{order.email}</td>

              <td>
                {order.items
                  ?.filter(
                    item =>
                      item.productType === "gift-voucher"
                  )
                  .map((item, i) => (
                  <div key={i} className="product-line">

  <span className={
    item.productType === "subscription"
      ? "subscription-badge"
      : "voucher-badge"
  }>
    {item.productType === "subscription"
      ? "SUB"
      : "CODE"}
  </span>

  {item.productName}

</div>
                  ))}
              </td>

              <td>
                {order.deliveredCodes?.length > 0
                  ? order.deliveredCodes.map((c, i) => (
                      <div key={i}>
                        🟢 {c.code}
                      </div>
                    ))
                  : "—"}
              </td>

              <td>
                ₹{order.totalPriceINR.toLocaleString('en-IN')}
              </td>

              <td>
                {new Date(order.createdAt).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>


    {/* ================= PAGINATION ================= */}

    <div className="pagination">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      >
        ⬅ Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      >
        Next ➡
      </button>

    </div>

  </>
)}
    </div>
  );
}

export default TransactionHistory;
