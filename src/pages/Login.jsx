import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { FiPhone } from "react-icons/fi";
import { login as loginApi } from "../api/authApi";


export default function Login() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
  if (!phone) return;

  try {
    const res = await loginApi({ phoneNumber: phone });
    loginUser(res.data);
    if (res.data.role === "Farmer") {
          navigate("/farmer");
        } else if (res.data.role === "Operator") {
          navigate("/operator");
        } else {
          navigate("/");
        }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-green-100 p-6">
      
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">
            Agri Rental
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tractor & Equipment Services
          </p>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Login
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter your mobile number to continue
        </p>

        <Input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Button
          label="Continue"
          onClick={handleLogin}
          disabled={!phone}
          type={phone ? "primary" : "secondary"}
        />
        <div className="mt-3 text-center">
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 text-sm text-green-600 font-semibold"
            title="Receive one-time code via SMS"
            aria-label="Sign in with OTP, receive code via SMS"
          >
            <FiPhone className="w-5 h-5 text-green-600" aria-hidden="true" />
            <span>Sign in with OTP</span>
          </Link>
        </div>

        {/* Footer Help */}
        <p className="text-xs text-center text-gray-500 mt-4">
          By continuing, you agree to local service terms
        </p>
      </div>
    </div>
  );
}
