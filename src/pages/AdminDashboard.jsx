import AppHeader from "../components/AppHeader";
import { FiUsers, FiShoppingBag, FiCreditCard, FiActivity, FiServer } from "react-icons/fi";

function StatCard({ icon: Icon, label, value, color }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses[color]}`}>
                <Icon />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    // Dummy data for visualization
    const stats = [
        { label: "Total Users", value: "1,248", icon: FiUsers, color: "blue" },
        { label: "Active Jobs", value: "42", icon: FiActivity, color: "green" },
        { label: "Total Bookings", value: "856", icon: FiShoppingBag, color: "purple" },
        { label: "Revenue", value: "₹4.2L", icon: FiCreditCard, color: "orange" },
    ];

    const recentActivity = [
        { id: 1, user: "Ramesh Farmer", action: "Booked a Tractor", time: "2 mins ago" },
        { id: 2, user: "Suresh Operator", action: "Completed Job #492", time: "15 mins ago" },
        { id: 3, user: "Mahesh Farmer", action: "Signed up", time: "1 hour ago" },
        { id: 4, user: "System", action: "Daily backup completed", time: "3 hours ago" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                <AppHeader title="Admin Console" />

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Area (Placeholder) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Platform Growth</h3>
                            <select className="text-sm border-gray-200 rounded-lg p-2 bg-gray-50">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="text-center">
                                <FiActivity className="text-4xl mx-auto mb-2 opacity-50" />
                                <p>Chart Visualization Area</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500">Farmers</p>
                                <p className="font-bold text-gray-900 text-lg">892</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500">Operators</p>
                                <p className="font-bold text-gray-900 text-lg">356</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500">Server Health</p>
                                <p className="font-bold text-green-600 text-lg flex items-center justify-center gap-1">
                                    <FiServer className="text-sm" /> 99.9%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 relative pb-6 last:pb-0">
                                    {/* Timeline line */}
                                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-100 last:hidden"></div>

                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{activity.user}</h4>
                                        <p className="text-sm text-gray-600">{activity.action}</p>
                                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
