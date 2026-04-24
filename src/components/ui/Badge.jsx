const BADGE_VARIANTS = {
  blue:  "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red:   "bg-red-50 text-red-600",
  slate: "bg-slate-100 text-slate-600",
};

const Badge = ({ children, variant = "slate", dot = false, className = "" }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${BADGE_VARIANTS[variant]} ${className}`}>
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full ${variant === "green" ? "bg-emerald-500" : variant === "blue" ? "bg-blue-500" : "bg-current"}`} />
    )}
    {children}
  </span>
);

export default Badge;
