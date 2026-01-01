import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import { confirmPayment } from "../api/paymentApi";

export default function FarmerPaymentConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { bookingId, bookingRef, operatorName, amount } = state;

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      debugger;
      const res = await confirmPayment({ bookingRef: bookingRef, paymentMode: paymentMode });

      if (res.data.statusCode === 200) {
        alert("Payment confirmed");
        navigate("/farmer");
      } else {
        alert(res.data.statusMessage);
      }
    } catch {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <AppHeader title="Confirm Payment" />

      <div className="bg-white p-4 rounded shadow mt-4 space-y-3">
        <p><strong>Booking:</strong> {bookingRef}</p>
        <p><strong>Operator:</strong> {operatorName}</p>
        <p className="text-lg font-semibold">Amount: ₹{amount}</p>

        <select
          value={paymentMode}
          onChange={e => setPaymentMode(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Online</option>
        </select>

        <Button
          label={loading ? "Confirming..." : "Mark as Paid"}
          onClick={handleConfirm}
          disabled={loading}
        />
      </div>
    </div>
  );
}
