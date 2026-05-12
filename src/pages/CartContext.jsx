import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

const CartContext = createContext();

export const CartProvider = ({
  children,
  userId
}) => {

  const [cartItems, setCartItems] = useState(() => {
    const savedCart =
      localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

  // ✅ Save cart in localStorage
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // =========================
  // ✅ ADD TO CART
  // =========================
  const addToCart = (product) => {

    setCartItems((prev) => {

      const existing = prev.find(
        item => item._id === product._id
      );

      // =========================
      // 📺 SUBSCRIPTION
      // =========================
      if (product.type === "subscription") {

        if (existing) {
          alert(
            "❌ Only 1 subscription allowed"
          );

          return prev;
        }

        return [
          ...prev,
          {
            ...product,
            quantity: 1
          }
        ];
      }

      // =========================
      // 🎁 GIFT VOUCHER
      // =========================
  // =========================
 // 🎁 ALL NON-SUBSCRIPTION PRODUCTS
 // =========================
 if (product.type !== "subscription") {

   // already exists → increase qty
   if (existing) {

     return prev.map((item) =>
       item._id === product._id
         ? {
             ...item,
             quantity: item.quantity + 1
           }
         : item
     );
   }

   // new item
   return [
     ...prev,
     {
       ...product,
       quantity: 1
     }
   ];
 }

      return prev;
    });
  };

  // =========================
  // ➕ INCREASE QUANTITY
  // =========================
  const increaseQuantity = (id) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  };

  // =========================
  // ➖ DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (id) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1
            }
          : item
      )
    );
  };

  // =========================
  // ❌ REMOVE ITEM
  // =========================
  const removeFromCart = (id) => {

    setCartItems((prev) =>
      prev.filter(
        item => item._id !== id
      )
    );
  };

  // =========================
  // 🧹 CLEAR CART
  // =========================
  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem("cart");
  };

  // =========================
  // 🛒 TOTAL COUNT
  // =========================
  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);