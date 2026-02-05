import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { signup } from "../api/authApi";
import { FaTractor, FaUser, FaToolbox } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

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
  const { t } = useTranslation();

  const isPhoneValid = (p) => /^\d{10}$/.test(p);

  const requestOtp = async () => {
    if (!isPhoneValid(phone)) {
      toast.error(t('auth.phone_placeholder')); // Reusing placeholder as error for now
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("enterOtp");
      toast.success(t('auth.send_code') + " (1234)");
    }, 800);
  };
  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter valid OTP");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!role) {
      toast.error("Please select a role");
      return;
    }

    setVerifying(true);
    try {
      await signup({
        name: fullName,
        phoneNumber: phone,
        role: role
      });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = () => {
    toast.success(t('auth.send_code') + " (1234)");
  };

  const roleCardClass = (r) => {
    return `cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === r
        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
        : "border-gray-200 bg-white text-gray-500 hover:border-green-200 hover:bg-gray-50"
      }`;
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* BRANDING SIDE */}
      <div className="hidden lg:flex w-1/2 bg-green-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="z-10 flex flex-col gap-6 mt-20">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
            <FaTractor className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl font-bold leading-tight">{t('app_name')}</h1>
          <p className="text-green-200 text-lg max-w-md">{t('auth.join_community')}</p>
        </div>
        {/* ... decorative elements ... */}
        <div className="z-10 text-sm opacity-50">
          © 2026 Agri Rental Services
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1625246333195-bf487435f928?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-12 bg-gray-50/50 overflow-y-auto">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          <div className="flex justify-between items-start mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
            >
              <FiArrowLeft /> {t('auth.back_to_login')}
            </button>
            <LanguageSwitcher />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.create_account')}</h2>
          <p className="text-gray-500 mb-6 text-sm">{t('auth.join_community')}</p>

          {step === "enterPhone" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.phone_label')}</label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder={t('auth.phone_placeholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full"
                />
              </div>

              <Button
                label={sending ? t('auth.sending_code') : t('auth.send_code')}
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
                  <label className="block text-sm font-medium text-gray-700">{t('auth.verify_code')}</label>
                  <span className="text-xs text-gray-400">{t('auth.sent_to')} +91 {phone}</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.full_name')}</label>
                <Input
                  placeholder={t('auth.your_name')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('auth.i_am_a')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={roleCardClass("Farmer")}
                    onClick={() => setRole("Farmer")}
                  >
                    <FaUser className="text-2xl mb-2" />
                    <span className="font-semibold text-sm">{t('roles.farmer')}</span>
                  </div>

                  <div
                    className={roleCardClass("Operator")}
                    onClick={() => setRole("Operator")}
                  >
                    <FaToolbox className="text-2xl mb-2" />
                    <span className="font-semibold text-sm">{t('roles.operator')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  label={verifying ? t('auth.creating_account') : t('auth.complete_signup')}
                  onClick={verifyOtp}
                  disabled={verifying}
                  fullWidth
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => setStep("enterPhone")}>{t('auth.change_number')}</button>
                <button className="text-sm text-green-600 font-medium hover:underline" onClick={resendOtp}>{t('auth.resend_code')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
