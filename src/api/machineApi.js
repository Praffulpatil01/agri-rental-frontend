import api from "./axios";

export const getMachines = async () => {
    const res = await api.post("/OperatorMachine/getmachines", "");
    return res.data;
};

export const Delete = async (id) => {
    debugger;
    const res = await api.get(`/OperatorMachine/machines/${id}`);
    return res.data;
};

export const addMachine = async (payload) => {
    debugger;
    const res = await api.post("/OperatorMachine/addmachine", payload);
    return res.data;
};

export const updateMachine = async (id, payload) => {
    debugger;
    const res = await api.put(`/OperatorMachine/machines/${id}`, payload);
    return res.data;
};

export const deleteMachine = async (id) => {
    debugger;
    const res = await api.delete(`/OperatorMachine/machines/${id}`);
    return res.data;
};

export const toggleMachineStatus = async (payload) => {
    // status: "Available" | "Offline"
    debugger;
    const res = await api.post("/OperatorMachine/machinesstatus", payload);
    return res.data;
};
