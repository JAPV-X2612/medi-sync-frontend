const SelectableChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
      active
        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
    }`}
  >
    {label}
  </button>
);

export default SelectableChip;
