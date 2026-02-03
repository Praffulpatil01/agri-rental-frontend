import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import { createBooking } from "../api/bookingApi";
import { FaCalendarAlt, FaMapMarkedAlt, FaRupeeSign, FaTractor } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

import { useToast } from "../context/ToastContext";

export default function CreateBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [area, setArea] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fallback if state is missing (should redirect in real app)
  if (!state || !state.prefill) {
    return <div className="p-4">Error: No booking data</div>;
  }

  const { equipmentId, equipmentName, pricePerHour } = state.prefill;

  const handleSubmit = async () => {
    if (!scheduledAt || !area) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createBooking({
        machineId: equipmentId,
        area,
        scheduledAt
      });

      if (res.data.statusCode === 201) {
        toast.success("Booking created successfully!");
        navigate("/farmer");
      } else {
        toast.error(res.data.statusMessage);
      }
    } catch {
      toast.error("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-xl mx-auto p-4">
        <AppHeader title="Confirm Booking" />

        <div className="mt-6 space-y-6">

          {/* SUMMARY CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

            <div className="flex items-start gap-4 z-10 relative">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                <FaTractor className="text-3xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{equipmentName}</h3>
                <div className="flex items-center text-gray-500 font-medium mt-1">
                  <FaRupeeSign className="text-sm mr-1" />
                  {pricePerHour} / hour
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h4 className="font-semibold text-gray-800 border-b pb-2">Booking Details</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaCalendarAlt />
                </div>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area / Scope
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaMapMarkedAlt />
                </div>
                <input
                  placeholder="e.g. 2 acres, or 'Full day'"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* COST ESTIMATION INFO */}
          <div className="bg-blue-50 rounded-xl p-4 flex gap-3 items-start text-blue-800 text-sm">
            <FiClock className="mt-0.5 shrink-0" />
            <p>Total cost will be calculated based on actual hours used after the job is completed by the operator.</p>
          </div>

          <div className="pt-4">
            <Button
              label={submitting ? "Confirming..." : "Confirm Booking"}
              onClick={handleSubmit}
              disabled={submitting}
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



// import { useState } from "react";
// import Button from "../components/Button";
// import Input from "../components/Input";

// export default function CreateBooking() {
//   const [area, setArea] = useState("");
//   const [service, setService] = useState("");

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Create Booking</h1>

//       <div className="space-y-4">
//         <Input
//           placeholder="Area (in acres)"
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//         />

//         <select
//           className="w-full border rounded-lg p-3 text-lg"
//           value={service}
//           onChange={(e) => setService(e.target.value)}
//         >
//           <option value="">Select Service</option>
//           <option>Ploughing</option>
//           <option>Rotavator</option>
//           <option>Harvesting</option>
//         </select>

//         <Button label="Submit Booking" />
//       </div>
//     </div>
//   );
// }
