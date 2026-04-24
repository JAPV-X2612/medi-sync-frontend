const PageHeader = ({ title, actions }) => (
  <header className="h-16 sticky top-0 z-10 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <h2 className="font-bold text-slate-900 tracking-tight">{title}</h2>
    {actions && <div className="flex items-center gap-4">{actions}</div>}
  </header>
);

export default PageHeader;
