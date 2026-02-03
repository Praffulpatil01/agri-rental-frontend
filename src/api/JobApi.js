import api from "./axios";

// export const trackJob = ({ bookingId, action, latitude, longitude }) =>
//     api.post("/job-tracking", {
//         bookingId,
//         action,       // "start" | "finish"
//         latitude,
//         longitude
//     });

export const trackJob = async (payload) => {
    const res = await api.post("/jobtracking/track", payload);
    return res.data;
};