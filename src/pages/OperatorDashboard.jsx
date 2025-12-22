import Button from "../components/Button";
import { useState, useMemo, useRef } from "react";
import { FiPhone, FiDollarSign, FiClock } from "react-icons/fi";

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

export default function OperatorDashboard() {
  const [jobs, setJobs] = useState([
    {
      id: "job-1",
      bookingRef: "BK-1001",
      farmerName: "Ram Kumar",
      farmerPhone: "9876543210",
      location: "Village A",
      area: "2 acres",
      scheduledAt: new Date().toISOString(),
      status: "assigned",
      startTime: null,
      endTime: null,
      price: 600,
      paymentStatus: "pending",
    },
    {
      id: "job-2",
      bookingRef: "BK-1002",
      farmerName: "Sita Devi",
      farmerPhone: "9123456780",
      location: "Village B",
      area: "1.5 acres",
      scheduledAt: new Date().toISOString(),
      status: "completed",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      price: 450,
      paymentStatus: "paid",
    },
  ]);

  const startFileRefs = useRef({});
  const finishFileRefs = useRef({});

  const totalEarnings = useMemo(
    () => jobs.filter(j => j.paymentStatus === "paid").reduce((s, j) => s + j.price, 0),
    [jobs]
  );

  const pendingAmount = useMemo(
    () => jobs.filter(j => j.paymentStatus === "pending" && j.status === "completed")
              .reduce((s, j) => s + j.price, 0),
    [jobs]
  );

  const updateJob = (id, patch) =>
    setJobs(js => js.map(j => j.id === id ? { ...j, ...patch } : j));

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-bold">Operator Dashboard</h1>

      {/* EARNINGS SUMMARY */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <FiDollarSign />
            <span className="text-sm">Total Earned</span>
          </div>
          <div className="text-2xl font-bold">₹{totalEarnings}</div>
        </div>

        <div className="bg-orange-50 border rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-700">
            <FiClock />
            <span className="text-sm">Pending</span>
          </div>
          <div className="text-2xl font-bold">₹{pendingAmount}</div>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white border rounded-lg p-4 shadow-sm">

            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{job.bookingRef}</h2>
                  <StatusBadge status={job.status} />
                  {job.status === "completed" && (
                    <PaymentBadge status={job.paymentStatus} />
                  )}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  Farmer: {job.farmerName} • {job.area}
                </div>
                <div className="text-sm text-gray-600">
                  Location: {job.location}
                </div>
              </div>

              <div className="text-right">
                <a
                  href={`tel:${job.farmerPhone}`}
                  className="text-green-600 text-sm flex items-center gap-1"
                >
                  <FiPhone /> Call
                </a>
                <div className="font-semibold mt-1">₹{job.price}</div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-3">
              {job.status === "assigned" && (
                <Button
                  label="Start Job"
                  onClick={() =>
                    updateJob(job.id, {
                      status: "in_progress",
                      startTime: new Date().toISOString(),
                    })
                  }
                />
              )}

              {job.status === "in_progress" && (
                <Button
                  label="Finish Job"
                  onClick={() =>
                    updateJob(job.id, {
                      status: "completed",
                      endTime: new Date().toISOString(),
                      paymentStatus: "pending",
                    })
                  }
                />
              )}

              {job.status === "completed" && (
                <div className="text-sm text-gray-600">
                  Completed on{" "}
                  {new Date(job.endTime).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
