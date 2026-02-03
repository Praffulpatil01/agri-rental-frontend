import Button from "../components/Button";
import { useState, useMemo, useRef, useEffect } from "react";
import { FiPhone, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { FaRupeeSign, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import AppHeader from "../components/AppHeader";
import { getOperatorDashboard } from "../api/operatorApi.js";
import { operatorAction } from "../api/bookingApi";
import { trackJob } from "../api/JobApi";
import { getCurrentLocation } from "../utils/geolocation";


function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === 'paid';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider gap-1 ${isPaid
        ? "bg-green-100 text-green-800"
        : "bg-orange-100 text-orange-800"
        }`}
    >
      {isPaid ? <FaCheckCircle className="text-[10px]" /> : <FaExclamationCircle className="text-[10px]" />}
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
}

import { useToast } from "../context/ToastContext";

export default function OperatorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const toast = useToast();

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getOperatorDashboard()
      .then(res => {
        if (res.data.statusCode === 200) {
          const mapped = res.data.data.map(j => ({
            ...j,
            price: Number(j.amount ?? 0),
            paymentStatus: j.paymentStatus?.toLowerCase() ?? "pending"
          }));
          setJobs(mapped);
        }
      })
      .catch(() => toast.error("Unauthorized or error loading dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = useMemo(
    () =>
      jobs
        .filter(j => j.paymentStatus === "paid")
        .reduce((s, j) => s + j.price, 0),
    [jobs]
  );

  const pendingAmount = useMemo(
    () =>
      jobs
        .filter(j => j.paymentStatus === "pending" && j.status === "completed")
        .reduce((s, j) => s + j.price, 0),
    [jobs]
  );

  const handleAction = async (job, action) => {
    try {
      const res = await operatorAction({ bookingRef: job.bookingRef, action: action });
      console.log("Action response:", res);
      if (res.statusCode === 200) {
        toast.success(`Job ${action === "accept" ? "Accepted" : "Rejected"}`);
        setJobs(prev =>
          prev.map(j =>
            j.bookingId === job.bookingId
              // Note: The API logic in original code mapped 'accept' -> 'assigned'
              ? { ...j, status: action === "accept" ? "assigned" : "rejected" }
              : j
          )
        );
      } else {
        toast.error(res.statusMessage);
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const handleStartJob = async (job) => {
    try {
      const loc = await getCurrentLocation();

      await trackJob({
        bookingId: job.bookingId,
        bookingRef: job.bookingRef,
        action: "start",
        latitude: loc.latitude,
        longitude: loc.longitude
      });

      toast.success("Job Started! Location tracked.");

      setJobs(prev =>
        prev.map(j =>
          j.bookingId === job.bookingId
            ? { ...j, status: "in_progress" }
            : j
        )
      );
    } catch {
      toast.error("Unable to start job (location required)");
    }
  };

  const handleFinishJob = async (job) => {
    try {
      const loc = await getCurrentLocation();

      await trackJob({
        bookingRef: job.bookingRef,
        bookingId: job.bookingId,
        action: "finish",
        latitude: loc.latitude,
        longitude: loc.longitude
      });

      toast.success("Job Completed! Earnings updated.");

      setJobs(prev =>
        prev.map(j =>
          j.bookingRef === job.bookingRef
            ? { ...j, status: "completed" }
            : j
        )
      );
    } catch {
      toast.error("Unable to finish job (location required)");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <AppHeader title="Operator Dashboard" />

        {/* EARNINGS STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg shadow-green-200">
            <div className="flex items-center gap-2 text-green-100 mb-1">
              <FaRupeeSign className="opacity-80" />
              <span className="text-xs font-semibold uppercase tracking-wider">Earned</span>
            </div>
            <div className="text-3xl font-bold">₹{totalEarnings}</div>
          </div>

          <div className="bg-white border boundary-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <FiClock />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Pending</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">₹{pendingAmount}</div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* JOB LIST */}
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.bookingId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">#{job.bookingRef}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">{job.area}</h2>
                </div>
                {job.status === "completed" && (
                  <PaymentBadge status={job.paymentStatus} />
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
                <div className="flex items-start gap-3">
                  <FiUser className="mt-1 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.farmerName}</p>
                    <a href={`tel:${job.farmerPhone}`} className="text-xs text-green-600 hover:underline">
                      {job.farmerPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="mt-1 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200 mt-2">
                  <div className="text-sm text-gray-500">Job Value:</div>
                  <div className="font-bold text-gray-900 flex items-center">
                    <FaRupeeSign className="text-xs mr-0.5" />
                    {job.amount}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                {job.status === "pending" && (
                  <>
                    <div className="flex-1">
                      <Button
                        label="Accept Job"
                        onClick={() => handleAction(job, "accept")}
                        fullWidth
                      />
                    </div>

                    <div className="flex-1">
                      <Button
                        label="Reject"
                        type="secondary" // Assuming Button component has a secondary or danger type, defaulting to safe
                        onClick={() => handleAction(job, "reject")}
                        fullWidth
                        className="!bg-red-50 !text-red-600 hover:!bg-red-100"
                      />
                    </div>
                  </>
                )}

                {job.status === "assigned" && (
                  <div className="w-full">
                    <Button
                      label="Start Job"
                      onClick={() => handleStartJob(job)}
                      fullWidth
                    />
                  </div>
                )}

                {job.status === "in_progress" && (
                  <div className="w-full">
                    <Button
                      label="Finish Job"
                      onClick={() => handleFinishJob(job)}
                      fullWidth
                      className="!bg-amber-500 hover:!bg-amber-600 !text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <FiClock className="text-2xl opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No jobs assigned</h3>
            <p className="text-gray-500 text-sm mt-1">You will be notified when a new job is available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

