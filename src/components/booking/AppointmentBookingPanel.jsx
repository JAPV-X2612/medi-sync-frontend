import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import IconLabeledField from "../ui/IconLabeledField";

const SpecialistIdentityBlock = ({ specialist }) => {
  const initials = specialist?.name?.split(" ").slice(1).map((n) => n[0]).join("").slice(0, 2) || "DR";
  return (
    <div className="text-center">
      <Avatar initials={initials} size="xl" className="mx-auto" />
      <h3 className="font-bold text-slate-900 text-xl mt-4">{specialist?.name || "—"}</h3>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
        {specialist?.specialty || "—"}
      </p>
    </div>
  );
};

const BookingConfirmFooter = ({ fee, onConfirm, loading }) => (
  <div className="pt-5 border-t border-slate-100">
    <div className="flex justify-between items-center mb-5 px-1">
      <span className="text-sm text-slate-500 font-medium">Total Payment</span>
      <span className="text-xl font-black text-slate-900">{fee || "—"}</span>
    </div>
    <Button variant="primary" size="full" onClick={onConfirm} loading={loading}>
      Confirm appointment
    </Button>
    <p className="text-[10px] text-center text-slate-400 mt-3 italic">
      By confirming, you agree to our 24-hour cancellation policy.
    </p>
  </div>
);

const AppointmentBookingPanel = ({ specialist, date, time, fee, onConfirm, loading = false }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 sticky top-20 flex flex-col gap-7">
    <SpecialistIdentityBlock specialist={specialist} />
    <div className="space-y-3">
      <IconLabeledField icon="event"    label="Date"             value={date || "—"} />
      <IconLabeledField icon="schedule" label="Time"             value={time || "—"} />
      <IconLabeledField icon="payments" label="Consultation Fee" value={fee  || "—"} />
    </div>
    <BookingConfirmFooter fee={fee} onConfirm={onConfirm} loading={loading} />
  </div>
);

export default AppointmentBookingPanel;
