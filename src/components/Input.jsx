export default function Input({ placeholder, value, onChange, type = "text", inputMode, maxLength, ariaLabel }) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      maxLength={maxLength}
      aria-label={ariaLabel || placeholder}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
    />
  );
} 
