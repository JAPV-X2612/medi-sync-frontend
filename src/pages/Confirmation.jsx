import PageHeader from "../components/layout/PageHeader";
import PageContainer from "../components/layout/PageContainer";
import AppointmentSummaryCard from "../components/cards/AppointmentSummaryCard";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

const Confirmation = ({ setPage, bookingData, user }) => {
  const {
    specialist,
    date            = "—",
    appointmentType = "In-person Consultation",
    address         = "450 Lexington Ave, New York, NY",
  } = bookingData || {};

  return (
    <>
      <PageHeader title="Confirmation" />

      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200/60">
                <Icon name="check" className="text-white text-4xl" fill={1} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Appointment confirmed!
            </h2>
            <p className="text-slate-500 leading-relaxed">
              A confirmation email has been sent to{" "}
              <span className="text-slate-800 font-semibold">{user?.email ?? "—"}</span> with your
              preparation guide.
            </p>
          </div>

          <AppointmentSummaryCard
            specialist={specialist}
            date={date}
            appointmentType={appointmentType}
            address={address}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" onClick={() => setPage("specialists")}>
              New appointment
            </Button>
            <Button variant="white" size="lg" onClick={() => setPage("dashboard")}>
              Back to home
            </Button>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default Confirmation;
