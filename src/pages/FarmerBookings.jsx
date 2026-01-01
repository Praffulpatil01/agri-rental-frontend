import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import { getFarmerBookings } from "../api/farmerApi";

function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    in_progress: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${
        status === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {status === "paid" ? "Paid" : "Pending"}
    </span>
  );
}

export default function FarmerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getFarmerBookings()
      .then(res => {
        if (res.data.statusCode === 200) {
          setBookings(res.data.data);
        }
      })
      .catch(() => alert("Error loading bookings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <AppHeader title="My Bookings" />

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.bookingId} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{b.bookingRef}</h3>
                <p className="text-sm text-gray-600">
                  Operator: {b.operatorName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(b.scheduledAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right space-y-1">
                <StatusBadge status={b.status} />
                {b.status === "completed" && (
                  <PaymentBadge status={b.paymentStatus} />
                )}
                <div className="font-semibold">₹{b.amount}</div>
              </div>
            </div>

            {b.status === "completed" && b.paymentStatus === "pending" && (
              <div className="mt-3">
                <Button
                  label="Pay Now"
                  onClick={() =>
                    navigate("/farmer/payment", {
                      state: {
                        bookingId: b.bookingId,
                        bookingRef: b.bookingRef,
                        operatorName: b.operatorName,
                        amount: b.amount
                      }
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No bookings yet
        </p>
      )}
    </div>
  );
}
