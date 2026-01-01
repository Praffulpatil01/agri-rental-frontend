import api from "./axios";

// export const confirmPayment = (bookingId, paymentMode) =>
//   api.post("/payments/confirm", { bookingId, paymentMode });

export const confirmPayment = async (payload) => {
  debugger;
  const res = await api.post("/Payment/confirm", payload);
  return res.data;
};