import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

function TransactionHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 search + pagination state
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  // 🔍 Filter orders
  const filteredOrders = orders.filter((order) =>
   `${order.fullName} ${order.email} ${order.orderId} ${
  order.items?.map(i => i.productName).join(' ')
} ${order.transactionId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="transaction-wrapper">
      <h2 className="transaction-title">📄 Transaction / Order History</h2>

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
        <div className="transaction-loading">Loading orders...</div>
      ) : currentOrders.length === 0 ? (
        <div className="transaction-empty">No orders found</div>
      ) : (
        <>
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Order ID</th>
                  <th>Razorpay Order ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td className="sr-no">
                      {startIndex + index + 1}
                    </td>
                    <td>{order.orderId}</td>

<td>
  {order.razorpayOrderId || '—'}
</td>

<td>{order.fullName}</td>

<td>{order.email}</td>

<td>{order.phone}</td>
                   <td className="product-cell">
  {order.items && order.items.length > 0
    ? order.items.map((item, i) => (
        <div key={i}>{item.productName}</div>
      ))
    : "No Product"}
</td>

<td className="center">
  {order.items && order.items.length > 0
    ? order.items.map((item, i) => (
        <div key={i}>{item.quantity}</div>
      ))
    : "0"}
</td>
                    <td className="price">
                      ₹{order.totalPriceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="txn-id">{order.transactionId || '—'}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
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
