import { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const icons = {
    success: <FiCheckCircle className="text-green-500 text-xl" />,
    error: <FiAlertCircle className="text-red-500 text-xl" />,
    info: <FiInfo className="text-blue-500 text-xl" />,
};

const styles = {
    success: "border-green-100 bg-green-50",
    error: "border-red-100 bg-red-50",
    info: "border-blue-100 bg-blue-50",
};

export default function Toast({ message, type = "info", onClose, duration = 3000 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Small delay to allow enter animation
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full transition-all duration-300 transform
        ${styles[type]}
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
      `}
        >
            <div>{icons[type]}</div>
            <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
            <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-600">
                <FiX />
            </button>
        </div>
    );
}
