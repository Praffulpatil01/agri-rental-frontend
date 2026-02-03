import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Signin from "../pages/Signin";
import FarmerDashboard from "../pages/FarmerDashboard";
import OperatorDashboard from "../pages/OperatorDashboard";
import CreateBooking from "../pages/CreateBooking";
import JobTracking from "../pages/JobTracking";
import FarmerBookings from "../pages/FarmerBookings";
import FarmerPaymentConfirm from "../pages/FarmerPaymentConfirm";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/admin" element={<AdminDashboard />} />

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
      <Route
        path="/create-booking"
        element={
          <ProtectedRoute roles={["Farmer"]}>
            <CreateBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/bookings"
        element={
          <ProtectedRoute roles={["Farmer"]}>
            <FarmerBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/payment"
        element={
          <ProtectedRoute roles={["Farmer"]}>
            <FarmerPaymentConfirm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
