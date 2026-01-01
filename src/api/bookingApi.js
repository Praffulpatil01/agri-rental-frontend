import api from "./axios";

export const createBooking = (payload) =>
  api.post("/Booking/Create", payload);

export const operatorAction = async (payload) => {
  const res = await api.post("/Operator/operatoraction", payload);
  return res.data;
};