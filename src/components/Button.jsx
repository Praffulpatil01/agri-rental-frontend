export default function Button({ label, onClick, type = "primary", disabled = false }) {
  const base =
    "w-full py-3 rounded-lg text-lg font-semibold active:scale-95 transition";

  const styles = {
    primary: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button onClick={onClick} className={`${base} ${styles[type]} ${disabledClass}`} disabled={disabled}>
      {label}
    </button>
  );
} 
