import Icon from "./Icon";
import Spinner from "./Spinner";

const BUTTON_VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200/60",
  outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  ghost:   "text-slate-600 hover:bg-slate-100",
  danger:  "bg-red-50 text-red-600 hover:bg-red-100",
  white:   "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
};

const BUTTON_SIZES = {
  sm:   "px-4 py-2 text-xs rounded-lg",
  md:   "px-6 py-2.5 text-sm rounded-xl",
  lg:   "px-8 py-3.5 text-sm rounded-xl",
  full: "w-full py-3.5 text-sm rounded-xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  icon,
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
  >
    {loading ? <Spinner size="sm" /> : icon && <Icon name={icon} className="text-[18px]" />}
    {children}
  </button>
);

export default Button;
