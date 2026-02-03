import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { signup } from "../api/authApi";
import { FaTractor, FaUser, FaToolbox } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

export default function Signin() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("enterPhone");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(""); // Farmer | Operator

  const navigate = useNavigate();
  const toast = useToast();

  const isPhoneValid = (p) => /^\d{10}$/.test(p);

  const requestOtp = async () => {
    if (!isPhoneValid(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setSending(true);
    // Mock sending OTP
    setTimeout(() => {
      setSending(false);
      setStep("enterOtp");
      toast.success("OTP sent successfully (Use 1234)");
    }, 800);
  };

  const verifyOtp = async () => {
    if (otp.length === 0) {
      toast.error("Please enter the OTP");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!role) {
      toast.error("Please select a user role");
      return;
    }
    setVerifying(true);

    try {
      const res = await signup({
        fullName: fullName,
        phoneNumber: phone,
        role: role
      });

      if (res.statusCode === 201) {
        toast.success("Account created successfully!");

        // Short delay for user to read success message
        setTimeout(() => {
          if (res.data.role === "Farmer") {
            navigate("/farmer");
          } else if (res.data.role === "Operator") {
            navigate("/operator");
          } else {
            navigate("/");
          }
        }, 1000);

      } else {
        toast.error(res.statusMessage || "Signup failed");
      }

    } catch (err) {
      toast.error(err.response?.data?.statusMessage || "Signup failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  const resendOtp = () => {
    setOtp("");
    requestOtp();
  };

  const roleCardClass = (r) => `
    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer w-full
    ${role === r
      ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
      : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-500'}
  `;

  return (
    <div className="min-h-screen flex bg-white">
      {/* BRANDING SIDE (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-green-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="z-10 flex flex-col gap-6 mt-20">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
            <FaTractor className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl font-bold leading-tight">Join the Future<br />of Farming</h1>
          <p className="text-green-200 text-lg max-w-md">Create an account to start booking equipment or offering your services to thousands of farmers.</p>
        </div>

        <div className="z-10 text-sm opacity-50">
          © 2024 Agri Rental Services
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1625246333195-bf487435f928?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-12 bg-gray-50/50 overflow-y-auto">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
          >
            <FiArrowLeft /> Back to Login
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 mb-6 text-sm">Join our agricultural community today</p>

          {step === "enterPhone" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full"
                />
              </div>

              <Button
                label={sending ? "Sending Code..." : "Send Verification Code"}
                onClick={requestOtp}
                disabled={sending}
                type="primary"
                fullWidth
              />
            </div>
          )}

          {step === "enterOtp" && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                  <span className="text-xs text-gray-400">Sent to +91 {phone}</span>
                </div>
                <Input
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full tracking-widest text-center text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <Input
                  placeholder="Your Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={roleCardClass("Farmer")}
                    onClick={() => setRole("Farmer")}
                  >
                    <FaUser className="text-2xl mb-2" />
                    <span className="font-semibold text-sm">Farmer</span>
                  </div>

                  <div
                    className={roleCardClass("Operator")}
                    onClick={() => setRole("Operator")}
                  >
                    <FaToolbox className="text-2xl mb-2" />
                    <span className="font-semibold text-sm">Operator</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  label={verifying ? "Creating Account..." : "Complete Signup"}
                  onClick={verifyOtp}
                  disabled={verifying}
                  fullWidth
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => setStep("enterPhone")}>Change Number</button>
                <button className="text-sm text-green-600 font-medium hover:underline" onClick={resendOtp}>Resend Code</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
