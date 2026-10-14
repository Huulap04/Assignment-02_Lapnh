export const getCartItemCount = (items) =>
  items.reduce((count, item) => count + item.quantity, 0);

export const getCartSubtotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export const formatCurrency = (amount) => `$${Number(amount || 0).toFixed(2)}`;
