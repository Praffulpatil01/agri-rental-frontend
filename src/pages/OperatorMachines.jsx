import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import { getMachines, deleteMachine, toggleMachineStatus } from "../api/machineApi";
import { useToast } from "../context/ToastContext";
import { FiPlus, FiEdit2, FiTrash2, FiPower } from "react-icons/fi";
import { FaTractor, FaRupeeSign } from "react-icons/fa";

export default function OperatorMachines() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const res = await getMachines();
            if (res.statusCode === 200) {
                setMachines(res.data);
            }
        } catch (err) {
            toast.error("Failed to load machines");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this machine?")) return;
        try {
            const res = await deleteMachine(id);
            if (res.statusCode === 200) {
                toast.success("Machine deleted successfully");
                setMachines(prev => prev.filter(m => m.id !== id));
            } else {
                toast.error(res.statusMessage || "Delete failed");
            }
        } catch {
            toast.error("Error deleting machine");
        }
    };

    const handleToggleStatus = async (machine) => {
        debugger;
        // const newStatus = Convert.ToBoolean(machine.status) === true ? "Offline" : "Available";
        const newStatus = Boolean(machine.isAvailable) ? "Offline" : "Available";
        try {
            const res = await toggleMachineStatus({ machineId: machine.machineId, isAvailable: machine.isAvailable });
            if (res.statusCode === 200) {
                toast.success(`Machine is now ${newStatus}`);
                setMachines(prev => prev.map(m => m.id === machine.id ? { ...m, status: newStatus } : m));
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-3xl mx-auto p-4 space-y-6">
                <AppHeader title="My Machines" />

                {/* Top Action */}
                <div className="flex justify-end">
                    <Link to="/operator/machines/add">
                        <Button label="Add New Machine" icon={FiPlus} />
                    </Link>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                )}

                <div className="grid gap-4">
                    {!loading && machines.map(machine => (
                        <div key={machine.machineId} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${machine.isAvailable === true ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <FaTractor />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{machine.machineType}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <FaRupeeSign className="text-xs" />
                                        {machine.rate} / {machine.rateUnit}
                                    </div>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${machine.isAvailable === true ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {machine.isAvailable}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                                <button
                                    onClick={() => handleToggleStatus(machine)}
                                    className={`flex-1 sm:flex-none py-2 px-3 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-1 ${machine.isAvailable === true ? 'text-orange-600 border-orange-100 hover:bg-orange-50' : 'text-green-600 border-green-100 hover:bg-green-50'}`}
                                >
                                    <FiPower /> {machine.isAvailable === true ? 'Disable' : 'Enable'}
                                </button>
                                {/* <Link
                                    to={`/operator/machines/edit/${machine.id}`}
                                    className="flex-1 sm:flex-none py-2 px-3 rounded-lg text-sm font-medium text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <FiEdit2 /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(machine.id)}
                                    className="flex-1 sm:flex-none py-2 px-3 rounded-lg text-sm font-medium text-red-600 border border-red-100 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <FiTrash2 /> Delete
                                </button> */}
                            </div>

                        </div>
                    ))}

                    {!loading && machines.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">You haven't added any machines yet.</p>
                            <Link to="/operator/machines/add">
                                <Button label="Add Your First Machine" type="secondary" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
