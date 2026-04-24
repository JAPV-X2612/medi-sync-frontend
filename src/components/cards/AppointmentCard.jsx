import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

const AppointmentMetaField = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon name={icon} className="text-blue-500 text-[18px]" />
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {
  const { id, doctor, specialty, location_detail, time, location, badge, urgent, initials } = appointment;
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 overflow-hidden transition-all hover:shadow-md hover:-translate-y-px ${urgent ? "border-blue-500" : "border-slate-200"}`}>
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex items-center gap-4 min-w-[250px]">
          <Avatar initials={initials} online={urgent} />
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{doctor}</h3>
            <p className="text-xs text-slate-500">
              {specialty}{location_detail && ` • ${location_detail}`}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-8">
          <AppointmentMetaField icon="schedule"    label="Time"     value={time}     />
          <AppointmentMetaField icon="location_on" label="Location" value={location} />
        </div>

        <div className="flex items-center gap-3">
          {badge && <Badge variant="blue">{badge}</Badge>}
          {onReschedule && (
            <Button variant="ghost" size="sm" onClick={() => onReschedule(id)} icon="edit_calendar">
              Reschedule
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={() => onCancel(id)} icon="close">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
