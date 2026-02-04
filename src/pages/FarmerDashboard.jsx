import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { FiPhone, FiUser, FiSearch, FiFilter } from "react-icons/fi";
import { FaTractor, FaRupeeSign, FaCalendarAlt } from "react-icons/fa";
import AppHeader from "../components/AppHeader";
import { getFarmerDashboard } from "../api/farmerApi";

function StatusBadge({ status }) {
  const map = {
    Available: "bg-green-50 text-green-700 border-green-200",
    Busy: "bg-amber-50 text-amber-700 border-amber-200",
    Offline: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const label = status === "Available" ? "Available Now" : status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || map.Offline}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Available' ? 'bg-green-500' : status === 'Busy' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
      {label}
    </span>
  );
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

import { useToast } from "../context/ToastContext";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getFarmerDashboard()
      .then(res => {
        if (res.data.statusCode === 200) {
          const mapped = res.data.data.map(item => ({
            id: item.equipmentid,
            name: item.equipment,
            type: item.equipment,
            status: item.status,
            nextAvailable: item.availableTime,
            pricePerHour: item.rate,
            operator: {
              name: item.operatorName,
              phone: item.operatorPhone
            }
          }));

          setEquipments(mapped);
        }
      })
      .catch(() => {
        toast.error("Unauthorized or error loading dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return equipments.filter(eq => {
      const matchesQuery =
        query.trim() === "" ||
        eq.name.toLowerCase().includes(query.toLowerCase()) ||
        eq.type.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && eq.status === "Available") ||
        (filter === "busy" && eq.status === "Busy");

      return matchesQuery && matchesFilter;
    });
  }, [query, filter, equipments]);

  const handleBook = (eq) => {
    navigate("/create-booking", {
      state: {
        prefill: {
          equipmentId: eq.id,
          equipmentName: eq.name,
          pricePerHour: eq.pricePerHour
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <AppHeader title="Farmer Dashboard" />

        {/* CONTROLS SECTION */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

            {/* SEARCH */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tractors, tools..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>

            {/* MY BOOKINGS BUTTON */}
            <div className="w-full md:w-auto">
              <Button
                label="My Bookings"
                onClick={() => navigate("/farmer/bookings")}
                type="secondary"
                className="!py-2.5"
                fullWidth={false}
              />
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <FiFilter /> Filter:
            </span>
            {["all", "available", "busy"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${filter === f
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* EQUIPMENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(eq => (
            <div
              key={eq.id}
              className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                      <FaTractor className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{eq.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {eq.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={eq.status} />
                    <div className="text-lg font-bold text-gray-900 flex items-center">
                      <FaRupeeSign className="text-sm text-gray-400 mr-0.5" />
                      {eq.pricePerHour}
                      <span className="text-sm font-normal text-gray-400 ml-1">/hr</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {/* <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>Next Available:</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatTime(eq.nextAvailable)}
                    </span>
                  </div> */}

                  <div className="flex items-center gap-3 pl-1">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <FiUser />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{eq.operator.name}</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <FiPhone className="w-3 h-3" /> {eq.operator.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <Button
                  label="Book Now"
                  onClick={() => handleBook(eq)}
                  type={eq.status === 'Available' ? 'primary' : 'secondary'}
                  disabled={eq.status !== 'Available'}
                />
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <FaTractor className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No equipment found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
            <button
              onClick={() => { setQuery(""); setFilter("all"); }}
              className="mt-4 text-green-600 text-sm font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

