import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import { confirmPayment } from "../api/paymentApi";
import { FaRupeeSign, FaShieldAlt, FaMoneyBillWave, FaMobileAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";

import { useToast } from "../context/ToastContext";

export default function FarmerPaymentConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Handle missing state gracefully
  if (!state) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <p>No payment information found.</p>
        <button
          onClick={() => navigate('/farmer/bookings')}
          className="mt-4 text-green-600 underline"
        >
          Go Back
        </button>
      </div>
    )
  }

  const { bookingId, bookingRef, operatorName, amount } = state;

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await confirmPayment({ bookingRef: bookingRef, paymentMode: paymentMode });

      if (res.data.statusCode === 200) {
        toast.success("Payment confirmed successfully!");
        navigate("/farmer");
      } else {
        toast.error(res.data.statusMessage);
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ mode, icon: Icon, label }) => (
    <div
      onClick={() => setPaymentMode(mode)}
      className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === mode
        ? 'border-green-600 bg-green-50 shadow-sm'
        : 'border-gray-100 hover:border-green-100 hover:bg-gray-50'
        }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 ${paymentMode === mode ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
        <Icon />
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${paymentMode === mode ? 'text-gray-900' : 'text-gray-700'}`}>{label}</p>
      </div>
      {paymentMode === mode && (
        <FaCheckCircle className="text-green-600 text-xl" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <AppHeader title="Confirm Payment" />

        <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 text-center">
            <p className="text-green-100 text-sm font-medium mb-1">Total Amount Due</p>
            <h1 className="text-4xl font-bold flex items-center justify-center">
              <FaRupeeSign className="text-2xl mr-1" />
              {amount}
            </h1>
            <div className="mt-4 pt-4 border-t border-green-500/50 flex justify-between text-sm">
              <span className="opacity-80">Booking Ref</span>
              <span className="font-mono font-medium">{bookingRef}</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-400 rounded-full opacity-30 blur-2xl"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <PaymentOption mode="Cash" icon={FaMoneyBillWave} label="Cash Payment" />
              <PaymentOption mode="UPI" icon={FaMobileAlt} label="UPI / GPay / PhonePe" />
              <PaymentOption mode="Online" icon={FaCreditCard} label="Credit / Debit Card" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <FaShieldAlt className="text-green-600" />
            Payments are secure and encrypted
          </div>

          <div>
            <Button
              label={loading ? "Processing..." : `Pay ₹${amount}`}
              onClick={handleConfirm}
              disabled={loading}
              fullWidth
            />
            <button
              onClick={() => navigate(-1)}
              className="w-full text-center py-3 text-gray-500 text-sm font-medium hover:text-gray-800 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
