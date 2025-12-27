// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "../pages/Login";
// import SelectRole from "../pages/SelectRole";
// import FarmerDashboard from "../pages/FarmerDashboard";
// import CreateBooking from "../pages/CreateBooking";
// import OperatorDashboard from "../pages/OperatorDashboard";
// import JobTracking from "../pages/JobTracking";
// import Signin from "../pages/Signin";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signin" element={<Signin />} />
//         <Route path="/role" element={<SelectRole />} />
//         <Route path="/farmer" element={<FarmerDashboard />} />
//         <Route path="/create-booking" element={<CreateBooking />} />
//         <Route path="/operator" element={<OperatorDashboard />} />
//         <Route path="/job" element={<JobTracking />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Signin from "../pages/Signin";
import FarmerDashboard from "../pages/FarmerDashboard";
import OperatorDashboard from "../pages/OperatorDashboard";
import CreateBooking from "../pages/CreateBooking";
import JobTracking from "../pages/JobTracking";

export default function AppRoutes() {
  debugger;
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Signin />} />

      {/* Farmer-only routes */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute roles={["Farmer"]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-booking"
        element={
          <ProtectedRoute roles={["Farmer"]}>
            <CreateBooking />
          </ProtectedRoute>
        }
      />

      {/* Operator-only routes */}
      <Route
        path="/operator"
        element={
          <ProtectedRoute roles={["Operator"]}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job"
        element={
          <ProtectedRoute roles={["Operator"]}>
            <JobTracking />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
