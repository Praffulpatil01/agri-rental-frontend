import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Input from "../components/Input";
import { useToast } from "../context/ToastContext";
import { addMachine } from "../api/machineApi";
import { FaTractor } from "react-icons/fa";

export default function AddMachine() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        MachineType: "",
        Rate: "",
        RateUnit: "PerHour", // Default
        IsAvailable: true
    });

    const machineTypes = ["Tractor", "Harvester", "Rotavator", "Sprayer", "Thresher", "Other"];
    const rateUnits = ["PerHour", "PerAcre"];

    const handleSubmit = async () => {
        if (!form.MachineType || !form.Rate) {
            toast.error("Please fill required fields");
            return;
        }
        setLoading(true);
        try {
            const res = await addMachine(form);
            if (res.statusCode === 201) {
                toast.success("Machine added successfully");
                navigate("/operator/machines");
            } else {
                toast.error(res.statusMessage || "Failed to add machine");
            }
        } catch {
            toast.error("Error adding machine");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-xl mx-auto p-4 space-y-6">
                <AppHeader title="Add Machine" />

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-3xl">
                            <FaTractor />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Machine Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {machineTypes.map(MachineType => (
                                <button
                                    key={MachineType}
                                    onClick={() => setForm({ ...form, MachineType })}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${form.MachineType === MachineType ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                                        }`}
                                >
                                    {MachineType}
                                </button>
                            ))}
                        </div>
                        {/* Fallback input for 'Other' could be added but sticking to list for simplicity per requirements */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Rate (₹)</label>
                        <Input
                            type="number"
                            placeholder="e.g. 1200"
                            value={form.Rate}
                            onChange={(e) => setForm({ ...form, Rate: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Rate Unit</label>
                        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                            {rateUnits.map(RateUnit => (
                                <button
                                    key={RateUnit}
                                    onClick={() => setForm({ ...form, RateUnit })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.RateUnit === RateUnit ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {RateUnit}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex-1">
                            <Button
                                label={loading ? "Saving..." : "Save Machine"}
                                onClick={handleSubmit}
                                disabled={loading}
                                fullWidth
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
