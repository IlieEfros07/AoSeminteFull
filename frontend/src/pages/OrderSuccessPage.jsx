import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await api.orders.getById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B5E20] font-semibold">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <header className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <a href="/" className="text-2xl font-extrabold flex items-center gap-2">
            <span className="bg-white text-[#1B5E20] w-10 h-10 rounded-full flex items-center justify-center text-xl">
              🌱
            </span>
            AO <span className="text-[#00C896]">Semințe</span>
          </a>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
              <span className="text-6xl">✓</span>
            </div>
            <h1 className="text-4xl font-black text-gray-800 mb-4">
              Comanda a fost plasată cu succes!
            </h1>
            <p className="text-xl text-gray-600">
              Mulțumim pentru comandă! Veți fi contactat în curând pentru confirmare.
            </p>
          </div>


          {order && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex justify-between items-start mb-6 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Comanda #{order.id}</h2>
                  <p className="text-gray-600">
                    Data: {new Date(order.created_at || Date.now()).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                    În așteptare
                  </span>
                </div>
              </div>


              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-700 mb-3">Informații de contact</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nume:</strong> {order.customer_name}</p>
                    <p><strong>Telefon:</strong> {order.customer_phone}</p>
                    {order.customer_email && (
                      <p><strong>Email:</strong> {order.customer_email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-3">Adresa de livrare</h3>
                  <p className="text-sm">{order.customer_address}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4">Produse comandate</h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{item.product?.name || `Produs #${item.product_id}`}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {item.price} MDL
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{(item.quantity * item.price).toFixed(2)} MDL</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total de plată:</span>
                  <span className="text-3xl font-black text-[#1B5E20]">
                    {order.total.toFixed(2)} MDL
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Ce urmează?
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <span>Veți fi contactat telefonic pentru confirmarea comenzii în 24 de ore</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <span>Comanda va fi pregătită și expediată în 1-2 zile lucrătoare</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <span>Veți primi produsele în 2-3 zile lucrătoare</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                <span>Plata se face la livrare (cash sau card)</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-[#00C896] hover:bg-[#00b584] text-white py-4 rounded-xl font-bold transition"
            >
              Înapoi la pagina principală
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex-1 border-2 border-[#00C896] text-[#00C896] hover:bg-[#00C896] hover:text-white py-4 rounded-xl font-bold transition"
            >
              Continuă cumpărăturile
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">Ai întrebări despre comandă?</p>
            <p>
              Contactează-ne la{' '}
              <a href="tel:+37322123456" className="text-[#00C896] font-semibold hover:underline">
                +373 22 123 456
              </a>
              {' '}sau{' '}
              <a href="mailto:info@aoseminte.md" className="text-[#00C896] font-semibold hover:underline">
                info@aoseminte.md
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;