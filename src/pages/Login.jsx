import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { FiPhone } from "react-icons/fi";
import { FaTractor } from "react-icons/fa";
import { login as loginApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Login() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!phone) return;
    setLoading(true);

    try {
      const res = await loginApi({ phoneNumber: phone });
      loginUser(res.data);
      toast.success(t('welcome') + "!");
      if (res.data.role === "Farmer") {
        navigate("/farmer");
      } else if (res.data.role === "Operator") {
        navigate("/operator");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* BRANDING SIDE (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-green-600 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="z-10 bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center">
          <FaTractor className="text-3xl" />
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">{t('app_name')}</h1>
          <p className="text-green-100 text-lg">Empowering Agriculture with Technology</p>
        </div>

        <div className="z-10 text-sm opacity-70">
          © 2026 Agri Rental Services
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50/50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          <div className="mb-8 text-center lg:text-left">
            <div className="flex justify-between items-center mb-4">
              <div className="inline-flex lg:hidden w-12 h-12 bg-green-100 rounded-xl items-center justify-center text-green-600">
                <FaTractor className="text-xl" />
              </div>
              <LanguageSwitcher />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('welcome')} Back</h2>
            <p className="text-gray-500 mt-2">Please login to your account</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              label={loading ? "Logging in..." : t('login')}
              onClick={handleLogin}
              disabled={!phone || loading}
              type="primary"
              fullWidth
              className="mt-2"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <Link
              to="/signin"
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors gap-2"
            >
              <FiPhone className="w-4 h-4 text-green-600" />
              <span>{t('signup')}</span>
            </Link>
          </div>

          <p className="text-xs text-center text-gray-400 mt-8">
            By logging in, you agree to our <span className="text-green-600 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-green-600 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
