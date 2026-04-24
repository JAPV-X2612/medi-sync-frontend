import Avatar from "../ui/Avatar";
import FieldLabel from "../ui/FieldLabel";
import Icon from "../ui/Icon";

const AppointmentLocationBlock = ({ address }) => (
  <div className="md:w-52">
    <FieldLabel>Location</FieldLabel>
    <div className="rounded-xl h-28 flex items-center justify-center mt-2 relative overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100">
      <Icon name="location_on" className="text-blue-600 text-4xl" fill={1} />
    </div>
    <p className="text-sm font-bold text-slate-900 mt-2">Central Medical Plaza</p>
    <p className="text-xs text-slate-500">{address}</p>
  </div>
);

const AppointmentSummaryCard = ({ specialist, date, appointmentType, address }) => {
  const initials = specialist?.name?.split(" ").slice(1).map((n) => n[0]).join("").slice(0, 2) || "DR";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 text-left">
      <div className="flex flex-col md:flex-row gap-7">
        <div className="flex-1 space-y-6">
          <div>
            <FieldLabel>Medical Specialist</FieldLabel>
            <div className="flex items-center gap-3 mt-2">
              <Avatar initials={initials} />
              <div>
                <h3 className="font-bold text-slate-900">{specialist?.name}</h3>
                <p className="text-blue-600 text-sm font-medium">{specialist?.specialty}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <FieldLabel>Date & Time</FieldLabel>
              <p className="font-semibold text-slate-800 text-sm mt-1">{date}</p>
            </div>
            <div>
              <FieldLabel>Appointment Type</FieldLabel>
              <p className="font-semibold text-slate-800 text-sm mt-1">{appointmentType}</p>
            </div>
          </div>
        </div>
        <AppointmentLocationBlock address={address} />
      </div>
    </div>
  );
};

export default AppointmentSummaryCard;
