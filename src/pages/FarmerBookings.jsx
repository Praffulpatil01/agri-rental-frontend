import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import { getFarmerBookings } from "../api/farmerApi";
import { FiCalendar, FiUser, FiClock, FiFileText } from "react-icons/fi";
import { FaRupeeSign, FaRegCalendarAlt, FaUser } from "react-icons/fa";

function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const icon = status === 'completed' ? '✓' : '•';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      <span className="mr-1">{icon}</span>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPaid
        ? "bg-green-100 text-green-800"
        : "bg-orange-100 text-orange-800"
        }`}
    >
      {isPaid ? "Paid" : "Pay Pending"}
    </span>
  );
}

import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

export default function FarmerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { t } = useTranslation();

  const getStatusLabel = (status) => {
    return t(`bookings.status.${status}`, status.replace(/_/g, " "));
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getFarmerBookings()
      .then(res => {
        if (res.data.statusCode === 200) {
          setBookings(res.data.data);
        }
      })
      .catch(() => toast.error("Error loading bookings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <AppHeader title={t('bookings.title')} />

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.bookingId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <FaRegCalendarAlt />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{b.bookingRef}</h3>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      {new Date(b.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
                {/* Custom Status Badge using translation */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border 
                  ${b.status === 'pending' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    b.status === 'assigned' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      b.status === 'in_progress' ? "bg-green-50 text-green-700 border-green-200" :
                        b.status === 'completed' ? "bg-gray-50 text-gray-700 border-gray-200" :
                          "bg-red-50 text-red-700 border-red-200"}`}>
                  <span className="mr-1">{b.status === 'completed' ? '✓' : '•'}</span>
                  {getStatusLabel(b.status)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase mb-1">{t('bookings.operator')}</p>
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <FaUser className="text-gray-400 text-sm" />
                    {b.operatorName}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase mb-1">{t('bookings.total_amount')}</p>
                  <div className="flex items-center gap-1 font-bold text-gray-900 text-lg">
                    <FaRupeeSign className="text-sm text-gray-400" />
                    {b.amount}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {b.status === "completed" && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                        ${b.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                      {b.paymentStatus === "paid" ? t('bookings.status.paid') : t('bookings.status.pay_pending')}
                    </span>
                  )}
                </div>

                {b.status === "completed" && b.paymentStatus === "pending" && (
                  <div className="w-32">
                    <Button
                      label={t('bookings.pay_now')}
                      size="sm"
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
            </div>
          ))}
        </div>

        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <FaRegCalendarAlt className="text-2xl opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t('bookings.no_bookings')}</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">{t('bookings.no_bookings_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
