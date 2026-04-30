import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completați toate câmpurile");
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.login(email, password);
      
      if (res.role !== "admin") {
        throw new Error("Acces interzis. Nu sunteți administrator.");
      }
      
      localStorage.setItem("admin_user_id", res.user_id);
      localStorage.setItem("admin_role", res.role);
      localStorage.setItem("admin_logged_in", "true");
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Email sau parolă incorectă");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E20] via-[#2d7a32] to-[#143d14] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#00C896] rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1B5E20] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white">
            🌱
          </div>
          <h1 className="text-3xl font-black text-[#1B5E20]">
            AO <span className="text-[#00C896]">Semințe</span>
          </h1>
          <p className="text-gray-500 mt-2">Panou de administrare</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] transition"
              placeholder="admin@aoseminte.md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Parolă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-lg transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#00C896] hover:bg-[#00b584] text-white shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Se conectează...
              </span>
            ) : (
              "Autentificare"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-500 hover:text-[#00C896] transition">
            ← Înapoi la site
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
