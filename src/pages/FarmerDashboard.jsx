import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { FiPhone, FiClock, FiUser } from "react-icons/fi";

function StatusBadge({ status }) {
  const map = {
    Available: "bg-green-100 text-green-800",
    Busy: "bg-yellow-100 text-yellow-800",
    Offline: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${map[status] || map.Offline}`}>
      {status}
    </span>
  );
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const equipments = [
    {
      id: "eq-1",
      name: "Tractor - Mahindra 575",
      type: "Tractor",
      status: "Available",
      nextAvailable: new Date().toISOString(),
      pricePerHour: 300,
      operator: { name: "Ramesh", phone: "9876543210" },
    },
    {
      id: "eq-2",
      name: "Rotavator - Kubota",
      type: "Rotavator",
      status: "Busy",
      nextAvailable: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      pricePerHour: 250,
      operator: { name: "Suresh", phone: "9123456780" },
    },
    {
      id: "eq-3",
      name: "Combine Harvester",
      type: "Harvester",
      status: "Offline",
      nextAvailable: "TBD",
      pricePerHour: 1200,
      operator: { name: "Mohit", phone: "9988776655" },
    },
  ];

  const filtered = useMemo(() => {
    return equipments.filter((eq) => {
      const matchesQuery = query.trim() === "" || eq.name.toLowerCase().includes(query.toLowerCase()) || eq.type.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "available" && eq.status === "Available") || (filter === "busy" && eq.status === "Busy");
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const handleBook = (eq) => {
    navigate("/create-booking", { state: { prefill: { equipmentId: eq.id, equipmentName: eq.name, pricePerHour: eq.pricePerHour } } });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Farmer Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, Farmer</div>
      </div>

      <div className="bg-green-100 p-4 rounded-lg mb-4">
        <p className="text-lg font-medium">Need tractor or equipment service?</p>
        <p className="text-sm text-gray-700">Choose from available equipment below and request service.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or type (e.g., tractor, rotavator)"
          className="w-full sm:w-2/3 border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex gap-2">
          <button className={`px-3 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-white border'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`px-3 py-2 rounded-md text-sm ${filter === 'available' ? 'bg-green-600 text-white' : 'bg-white border'}`} onClick={() => setFilter('available')}>Available</button>
          <button className={`px-3 py-2 rounded-md text-sm ${filter === 'busy' ? 'bg-green-600 text-white' : 'bg-white border'}`} onClick={() => setFilter('busy')}>Busy</button>
        </div>
      </div>

      {/* Equipment list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((eq) => (
          <div key={eq.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">📣</div>
                <div>
                  <h3 className="text-md font-semibold">{eq.name}</h3>
                  <p className="text-sm text-gray-600">{eq.type} • ₹{eq.pricePerHour}/hr</p>
                </div>
              </div>

              <div className="text-right space-y-2">
                <StatusBadge status={eq.status} />
                <div className="text-xs text-gray-500">Next: <span className="font-medium text-gray-700">{formatTime(eq.nextAvailable)}</span></div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium">{eq.operator.name}</div>
                  <a href={`tel:${eq.operator.phone}`} className="text-xs text-green-600 flex items-center gap-2"><FiPhone className="w-4 h-4" /> {eq.operator.phone}</a>
                </div>
              </div>

              <div className="w-36">
                <Button label="Book" onClick={() => handleBook(eq)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 text-center text-gray-500">No equipment found — try a different filter or search term.</div>
      )}

    </div>
  );
}
