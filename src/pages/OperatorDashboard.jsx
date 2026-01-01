import Button from "../components/Button";
import { useState, useMemo, useRef, useEffect } from "react";
import { FiPhone, FiDollarSign, FiClock } from "react-icons/fi";
import AppHeader from "../components/AppHeader";
import { getOperatorDashboard } from "../api/operatorApi.js";
import { operatorAction } from "../api/bookingApi";

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
  debugger
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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getOperatorDashboard()
      .then(res => {
        if (res.data.statusCode === 200) {
          debugger;
          const mapped = res.data.data.map(j => ({
            ...j,
            price: Number(j.amount ?? 0),
            paymentStatus: j.paymentStatus?.toLowerCase() ?? "pending"
          }));
          setJobs(mapped);
        }
      })
      .catch(() => alert("Unauthorized or error loading dashboard"))
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
      debugger;
      const res = await operatorAction({ bookingRef: job.bookingRef, action: action });
      console.log("Action response:", res);
      if (res.statusCode === 200) {
        setJobs(prev =>
          prev.map(j =>
            j.bookingId === job.bookingId
              ? { ...j, status: action === "accept" ? "assigned" : "rejected" }
              : j
          )
        );
      } else {
        alert(res.statusMessage);
      }
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <AppHeader title="Operator Dashboard" />

      {/* EARNINGS */}
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

      {loading && <p className="text-center text-gray-500">Loading jobs...</p>}

      {/* JOB LIST */}
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.bookingId} className="bg-white border rounded-lg p-4 shadow-sm">
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
                <div className="font-semibold mt-1">₹{job.amount} </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-3 flex gap-2">
              {job.status === "pending" && (
                <>
                  <Button
                    label="Accept"
                    onClick={() => handleAction(job, "accept")}
                  />
                  <Button
                    label="Reject"
                    type="secondary"
                    onClick={() => handleAction(job, "reject")}
                  />
                </>
              )}

              {job.status === "assigned" && (
                <Button
                  label="Reject"
                  type="secondary"
                  onClick={() => handleAction(job, "reject")}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && jobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs assigned yet</p>
      )}
    </div>
  );
}


// import Button from "../components/Button";
// import { useState, useMemo, useRef, useEffect } from "react";
// import { FiPhone, FiDollarSign, FiClock } from "react-icons/fi";
// import AppHeader from "../components/AppHeader";
// import { getOperatorDashboard } from "../api/operatorApi";
// import { operatorAction } from "../api/bookingApi";


// function StatusBadge({ status }) {
//   const map = {
//     pending: "bg-yellow-100 text-yellow-800",
//     assigned: "bg-blue-100 text-blue-800",
//     in_progress: "bg-green-100 text-green-800",
//     completed: "bg-gray-100 text-gray-700",
//     rejected: "bg-red-100 text-red-700",
//   };
//   return (
//     <span className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}>
//       {status.replace(/_/g, " ")}
//     </span>
//   );
// }

// function PaymentBadge({ status }) {
//   return (
//     <span
//       className={`px-2 py-1 rounded text-xs font-semibold ${
//         status === "paid"
//           ? "bg-green-100 text-green-700"
//           : "bg-orange-100 text-orange-700"
//       }`}
//     >
//       {status === "paid" ? "Paid" : "Pending"}
//     </span>
//   );
// }

// export default function OperatorDashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const fetchedRef = useRef(false); // prevent double API hit (React 18)

//   useEffect(() => {
//     if (fetchedRef.current) return;
//     fetchedRef.current = true;

//     getOperatorDashboard()
//       .then(res => {
//         if (res.data.statusCode === 200) {
//           console.log("Fetched jobs:", res.data.data);
//           setJobs(res.data.data);
//         }
//       })
//       .catch(() => {
//         alert("Unauthorized or error loading operator dashboard");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const totalEarnings = useMemo(
//     () =>
//       jobs
//         .filter(j => j.paymentStatus === "paid")
//         .reduce((s, j) => s + j.price, 0),
//     [jobs]
//   );

//   const pendingAmount = useMemo(
//     () =>
//       jobs
//         .filter(j => j.paymentStatus === "pending" && j.status === "completed")
//         .reduce((s, j) => s + j.price, 0),
//     [jobs]
//   );

//   const handleAction = async (jobs, action) => {
//     debugger;
//   try {
//     const res = await operatorAction(jobs.bookingId, action);

//     if (res.data.statusCode === 200) {
//       // Update UI locally (no re-fetch needed)
//       setJobs(prev =>
//         prev.map(j =>
//           j.bookingRef === jobs.bookingRef
//             ? { ...j, status: action === "accept" ? "assigned" : "rejected" }
//             : j
//         )
//       );
//     } else {
//       alert(res.data.statusMessage);
//     }
//   } catch {
//     alert("Action failed");
//   }
// };

//   return (
//     <div className="p-4 max-w-3xl mx-auto space-y-4">
//       <AppHeader title="Operator Dashboard" />

//       {/* EARNINGS SUMMARY */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="bg-green-50 border rounded-lg p-4">
//           <div className="flex items-center gap-2 text-green-700">
//             <FiDollarSign />
//             <span className="text-sm">Total Earned</span>
//           </div>
//           <div className="text-2xl font-bold">₹{totalEarnings}</div>
//         </div>

//         <div className="bg-orange-50 border rounded-lg p-4">
//           <div className="flex items-center gap-2 text-orange-700">
//             <FiClock />
//             <span className="text-sm">Pending</span>
//           </div>
//           <div className="text-2xl font-bold">₹{pendingAmount}</div>
//         </div>
//       </div>
//       {loading && (
//         <p className="text-center text-gray-500">Loading jobs...</p>
//       )}

//       <div className="space-y-4">
//         {jobs.map(job => (
//           <div key={job.bookingRef} className="bg-white border rounded-lg p-4 shadow-sm">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h2 className="font-semibold">{job.bookingRef}</h2>
//                   <StatusBadge status={job.status} />
//                   {job.status === "completed" && (
//                     <PaymentBadge status={job.paymentStatus} />
//                   )}
//                 </div>

//                 <div className="text-sm text-gray-600 mt-1">
//                   Farmer: {job.farmerName} • {job.area}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Location: {job.location}
//                 </div>
//               </div>

//               <div className="text-right">
//                 <a
//                   href={`tel:${job.farmerPhone}`}
//                   className="text-green-600 text-sm flex items-center gap-1"
//                 >
//                   <FiPhone /> Call
//                 </a>
//                 <div className="font-semibold mt-1">₹{job.amount}</div>
//               </div>
//             </div>

//             {/* STATUS INFO */}
//             {job.status === "completed" && job.endTime && (
//               <div className="mt-2 text-sm text-gray-600">
//                 Completed on {new Date(job.endTime).toLocaleString()}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* ACTION BUTTONS */}
//         <div className="mt-3 flex gap-2">
//           {jobs.status === "pending" && (
//             <>
//               <Button
//                 label="Accept"
//                 onClick={() => handleAction(job, "accept")}
//               />
//               <Button
//                 label="Reject"
//                 type="secondary"
//                 onClick={() => handleAction(jobs, "reject")}
//               />
//             </>
//           )}

//           {jobs.status === "assigned" && (
//             <Button
//               label="Reject"
//               type="secondary"
//               onClick={() => handleAction(jobs, "reject")}
//             />
//           )}
//         </div>
//       </div>

//       {!loading && jobs.length === 0 && (
//         <p className="text-center text-gray-500">
//           No jobs assigned yet
//         </p>
//       )}
//     </div>
//   );
// }

