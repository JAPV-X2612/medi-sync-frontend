import Avatar from "../ui/Avatar";
import Icon from "../ui/Icon";

const BOOKING_PAGES = ["specialists", "slots", "confirmation"];

const NAV_ITEMS = [
  { id: "dashboard",   icon: "grid_view",      label: "Home" },
  { id: "specialists", icon: "calendar_today", label: "New Appointment" },
];

const SidebarNavItem = ({ id, icon, label, activePage, onNavigate }) => {
  const active = activePage === id || (id === "specialists" && BOOKING_PAGES.includes(activePage));
  return (
    <button
      onClick={() => onNavigate(id)}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left w-full ${
        active
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon name={icon} className="text-[20px]" />
      {label}
    </button>
  );
};

const NavigationSidebar = ({ page, setPage, user }) => (
  <aside className="w-56 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col py-8 px-5 gap-8 z-20 shadow-sm">
    <div>
      <h1 className="text-lg font-black tracking-tight text-slate-900">MediSync</h1>
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
        Clinical Curator
      </p>
    </div>

    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <SidebarNavItem key={item.id} {...item} activePage={page} onNavigate={setPage} />
      ))}
    </nav>

    {user && (
      <div className="mt-auto flex items-center gap-3 px-1">
        <Avatar
          initials={user.fullName?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "U"}
          size="sm"
        />
        <div>
          <p className="text-xs font-bold text-slate-900 leading-tight">{user.fullName}</p>
          <p className="text-[10px] text-slate-400">{user.role}</p>
        </div>
      </div>
    )}
  </aside>
);

export default NavigationSidebar;
