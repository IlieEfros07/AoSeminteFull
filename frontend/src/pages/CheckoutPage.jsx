import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartSubtotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    city: '',
    postal_code: '',
    notes: '',
    payment_method: 'cash', 
  });

  const [errors, setErrors] = useState({});

  const shippingCost = getCartSubtotal() >= 500 ? 0 : 50;
  const total = getCartSubtotal() + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Numele este obligatoriu';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Telefonul este obligatoriu';
    } else if (!/^[0-9+\s()-]{8,}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Număr de telefon invalid';
    }

    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email invalid';
    }

    if (!formData.customer_address.trim()) {
      newErrors.customer_address = 'Adresa este obligatorie';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Orașul este obligatoriu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (cart.length === 0) {
      setError('Coșul este gol');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || null,
        customer_address: `${formData.customer_address}, ${formData.city}${formData.postal_code ? ', ' + formData.postal_code : ''}${formData.notes ? ' - ' + formData.notes : ''}`,
        total: total,
        payment_status: 'pending',
        order_status: 'new',
        user_id: null, 
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await api.orders.create(orderData);

      clearCart();

      navigate(`/order-success/${response.id}`);

    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'A apărut o eroare la procesarea comenzii. Vă rugăm încercați din nou.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Coșul tău este gol</h2>
          <p className="text-gray-600 mb-6">Adaugă produse pentru a continua cu comanda</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#00C896] hover:bg-[#00b584] text-white px-8 py-3 rounded-full font-bold transition"
          >
            Continuă cumpărăturile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <header className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-extrabold flex items-center gap-2">
              <span className="bg-white text-[#1B5E20] w-10 h-10 rounded-full flex items-center justify-center text-xl">
                🌱
              </span>
              AO <span className="text-[#00C896]">Semințe</span>
            </a>
            <div className="text-sm">
              <span className="opacity-70">Finalizare comandă</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="text-sm font-semibold text-gray-700">Coș</span>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm font-semibold text-green-600">Date livrare</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm text-gray-500">Confirmare</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>📋</span> Informații de contact
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nume complet *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] ${
                        errors.customer_name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Ion Popescu"
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] ${
                        errors.customer_phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="+373 XX XXX XXX"
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email (opțional)
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] ${
                      errors.customer_email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="email@exemplu.com"
                  />
                  {errors.customer_email && (
                    <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>📍</span> Adresa de livrare
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresa *
                    </label>
                    <input
                      type="text"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] ${
                        errors.customer_address ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Strada, număr, bloc, apartament"
                    />
                    {errors.customer_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Oraș *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] ${
                          errors.city ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Chișinău"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cod poștal (opțional)
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
                        placeholder="MD-2XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Observații (opțional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
                      placeholder="Instrucțiuni speciale de livrare..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>💳</span> Metodă de plată
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#00C896] transition">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#00C896]"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💵</span>
                        <span className="font-semibold">Plată la livrare (Cash)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Plătești când primești produsele
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#00C896] transition">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#00C896]"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        <span className="font-semibold">Plată cu cardul</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Card bancar sau transfer
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <p>
                    <strong>Notă:</strong> Plata cu cardul va fi activată în curând.
                    Momentan puteți plăti la livrare.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                  loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#00C896] hover:bg-[#00b584] text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Se procesează...
                  </span>
                ) : (
                  `Finalizează comanda (${total.toFixed(2)} MDL)`
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Sumar comandă</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: item.image_url
                            ? `url(${item.image_url})`
                            : `url(https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=200&fit=crop)`,
                        }}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {item.price} MDL
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {(item.price * item.quantity).toFixed(2)} MDL
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{getCartSubtotal().toFixed(2)} MDL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livrare:</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratuită</span>
                    ) : (
                      `${shippingCost} MDL`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-3xl font-black text-[#1B5E20]">
                    {total.toFixed(2)} MDL
                  </span>
                </div>
              </div>


              {shippingCost > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  Mai adaugă {(500 - getCartSubtotal()).toFixed(2)} MDL pentru livrare gratuită!
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>✓</span>
                  <span>Plată securizată</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>✓</span>
                  <span>Livrare rapidă 2-3 zile</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>✓</span>
                  <span>Retur 14 zile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;