import Icon from "./Icon";

const EmptyState = ({ icon = "inbox", title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
      <Icon name={icon} className="text-slate-400 text-3xl" />
    </div>
    <div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      {description && <p className="text-slate-500 text-sm">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
