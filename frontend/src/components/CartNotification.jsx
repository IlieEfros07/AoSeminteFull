import { useCart } from '../context/CartContext';

function CartNotification() {
  const { showNotification, notificationMessage } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slideUp">
      <div className="bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3">
        <span className="text-2xl">✓</span>
        <span className="font-semibold">{notificationMessage}</span>
      </div>
    </div>
  );
}

export default CartNotification;