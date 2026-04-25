import PageHeader from "../components/layout/PageHeader";
import PageContainer from "../components/layout/PageContainer";
import AppointmentCard from "../components/cards/AppointmentCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { useAppointments } from "../hooks/useApi";
import api from "../services/api";
import { formatTodayLabel } from "../utils/time";

const Dashboard = ({ setPage, user }) => {
  const { appointments, loading, error, refresh } = useAppointments();

  const handleCancel = async (id) => {
    try {
      await api.cancelAppointment(id);
      refresh();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    }
  };
  const handleReschedule = (id) => console.log("TODO: reschedule", id);

  return (
    <>
      <PageHeader
        title="Your Appointments"
        actions={
          <Button variant="primary" size="sm" icon="add" onClick={() => setPage("specialists")}>
            New appointment
          </Button>
        }
      />

      <PageContainer className="max-w-4xl space-y-10">
        <section>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Good morning, {user?.name ?? "—"}
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">
            {loading
              ? "Loading your schedule…"
              : `You have ${appointments.length} appointment${appointments.length !== 1 ? "s" : ""} scheduled for today.`}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Today, {formatTodayLabel()}</h2>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">Failed to load appointments. Please try again.</p>
          )}

          {!loading && !error && appointments.length === 0 && (
            <EmptyState
              icon="event_available"
              title="No appointments today"
              description="Your schedule is clear for today."
              action={
                <Button variant="primary" size="md" onClick={() => setPage("specialists")}>
                  Book an appointment
                </Button>
              }
            />
          )}

          {!loading && appointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
            />
          ))}
        </section>
      </PageContainer>
    </>
  );
};

export default Dashboard;
