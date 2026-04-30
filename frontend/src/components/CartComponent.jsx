import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartSubtotal } = useCart();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-[#00C896] transition relative"
      >
        🛒
        {getCartTotal() > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#00C896] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {getCartTotal()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Coșul tău ({getCartTotal()} produse)
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-600 mb-2">Coșul tău este gol</p>
                <p className="text-sm text-gray-500">Adaugă produse pentru a continua</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: item.image_url
                            ? `url(${item.image_url})`
                            : `url(https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=200&fit=crop)`,
                        }}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setIsOpen(false)}
                        className="font-semibold text-gray-800 hover:text-[#00C896] block mb-1 line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-[#00C896] font-semibold mb-2">
                        {item.price} MDL
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {(item.price * item.quantity).toFixed(2)} MDL
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-2xl font-bold text-[#1B5E20]">
                  {getCartSubtotal().toFixed(2)} MDL
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-4 p-3 bg-green-50 rounded-lg">
                {getCartSubtotal() >= 500 ? (
                  <span className="text-green-600 font-semibold">
                    ✓ Livrare gratuită!
                  </span>
                ) : (
                  <span>
                    Mai adaugă {(500 - getCartSubtotal()).toFixed(2)} MDL pentru livrare gratuită
                  </span>
                )}
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#00C896] hover:bg-[#00b584] text-white text-center py-3 rounded-xl font-bold transition"
              >
                Finalizează comanda →
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 text-gray-600 hover:text-[#00C896] text-sm font-semibold mt-2"
              >
                Continuă cumpărăturile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CartDropdown;