import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { signup } from "../api/authApi";

export default function Signin() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("enterPhone");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(""); // Farmer | Operator


  const navigate = useNavigate();
  const { login } = useAuth();

  const isPhoneValid = (p) => /^\d{10}$/.test(p);

  const requestOtp = async () => {
    if (!isPhoneValid(phone)) {
      setMessage({ type: "error", text: "Enter a 10-digit mobile number" });
      return;
    }
    setSending(true);
    setMessage({ type: "info", text: "Sending OTP..." });
    // Mock sending OTP
    setTimeout(() => {
      setSending(false);
      setStep("enterOtp");
      setMessage({ type: "success", text: "OTP sent (mock: 1234)" });
      // In real app, don't expose OTP
      // console.log("Mock OTP: 1234");
    }, 800);
  };

  const verifyOtp = async () => {
    debugger
    if (otp.trim().length === 0) {
      setMessage({ type: "error", text: "Enter the OTP" });
      return;
    }
    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Enter full name" });
      return;
    }

    if (!role) {
      setMessage({ type: "error", text: "Select a role" });
      return;
    }
    setVerifying(true);
    setMessage({ type: "info", text: "Verifying..." });

    try {
      // 🔴 Real signup API call
      const res = await signup({
        fullName: fullName,
        phoneNumber: phone,
        role: role
      });

      console.log(res); // ✅ FIXED

      if (res.statusCode === 201) {

        // login(res.data);

        setMessage({ type: "success", text: res.statusMessage });

        if (res.data.role === "Farmer") {
          navigate("/farmer");
        } else if (res.data.role === "Operator") {
          navigate("/operator");
        } else {
          navigate("/");
        }

      } else {
        setMessage({
          type: "error",
          text: res.statusMessage
        });
      }

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.statusMessage || "Signup failed"
      });
    } finally {
      setVerifying(false);
    }
  }

  const resendOtp = () => {
    setOtp("");
    requestOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-green-100 p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-green-700">Agri Rental</h1>
          <p className="text-sm text-gray-600 mt-1">Sign in to continue</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
            role="status"
          >
            {message.text}
          </div>
        )}

        {step === "enterPhone" && (
          <>
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            />

            <Button
              label={sending ? "Sending..." : "Send OTP"}
              onClick={requestOtp}
              disabled={sending}
              type={isPhoneValid(phone) ? "primary" : "secondary"}
            />
          </>
        )}

        {step === "enterOtp" && (
          <>
            <p className="text-sm text-gray-600 mb-3">Enter the 4-digit OTP sent to {phone}</p>
            <Input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              inputMode="numeric"
              maxLength={6}
            />
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3 mt-3 mb-2">
              <button
                type="button"
                onClick={() => setRole("Farmer")}
                className={`py-3 rounded-lg border text-sm font-semibold ${role === "Farmer"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700"
                  }`}
              >
                Farmer
              </button>

              <button
                type="button"
                onClick={() => setRole("Operator")}
                className={`py-3 rounded-lg border text-sm font-semibold ${role === "Operator"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700"
                  }`}
              >
                Operator
              </button>
            </div>
            <Button label={verifying ? "Verifying..." : "Verify OTP"} onClick={verifyOtp} disabled={verifying} />

            <div className="flex items-center justify-between mt-4">
              <button className="text-sm text-gray-600" onClick={() => setStep("enterPhone")}>Change number</button>
              <button className="text-sm text-green-600 font-semibold" onClick={resendOtp}>Resend</button>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <button className="text-sm text-gray-500" onClick={() => navigate('/')}>Back to Login</button>
        </div>
      </div>
    </div>
  );
}
