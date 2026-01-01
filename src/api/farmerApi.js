import api from "./axios";

export const getFarmerDashboard = () =>
  api.get("/farmer/dashboard");

export const getFarmerBookings = () =>
  api.get("/farmer/bookings");