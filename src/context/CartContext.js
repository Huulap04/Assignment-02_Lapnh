import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadCart, saveCart } from "../storage/cartStorage";
import { getCartItemCount, getCartSubtotal } from "../utils/cartSelectors";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "RESTORE":
      return {
        ...state,
        items: Array.isArray(action.items) ? action.items : [],
        ready: true,
      };
    case "ADD": {
      const existing = state.items.find((item) => item.id === action.product.id);
      const items = existing
        ? state.items.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...state.items, { ...action.product, quantity: 1 }];
      return { ...state, items };
    }
    case "SET_QUANTITY": {
      const quantity = Math.max(0, Math.floor(Number(action.quantity) || 0));
      return {
        ...state,
        items:
          quantity === 0
            ? state.items.filter((item) => item.id !== action.id)
            : state.items.map((item) =>
                item.id === action.id ? { ...item, quantity } : item,
              ),
      };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], ready: false });

  useEffect(() => {
    loadCart()
      .then((items) => dispatch({ type: "RESTORE", items }))
      .catch((error) => {
        console.warn("cart restore failed", error);
        dispatch({ type: "RESTORE", items: [] });
      });
  }, []);

  useEffect(() => {
    if (state.ready)
      saveCart(state.items).catch((error) => console.warn("cart save failed", error));
  }, [state.items, state.ready]);

  const value = useMemo(
    () => ({
      ...state,
      itemCount: getCartItemCount(state.items),
      subtotal: getCartSubtotal(state.items),
      add: (product) => dispatch({ type: "ADD", product }),
      setQuantity: (id, quantity) => dispatch({ type: "SET_QUANTITY", id, quantity }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
