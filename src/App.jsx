import { useState } from "react";
import NavigationSidebar from "./components/layout/NavigationSidebar";
import { useUser } from "./hooks/useApi";
import Dashboard      from "./pages/Dashboard";
import FindSpecialist from "./pages/FindSpecialist";
import TimeSlots      from "./pages/TimeSlots";
import Confirmation   from "./pages/Confirmation";

const PAGES = {
  dashboard:    Dashboard,
  specialists:  FindSpecialist,
  slots:        TimeSlots,
  confirmation: Confirmation,
};

export default function App() {
  const [page, setPage]                             = useState("dashboard");
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [bookingData, setBookingData]               = useState(null);

  const { user } = useUser();

  const PageComponent = PAGES[page] ?? Dashboard;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NavigationSidebar page={page} setPage={setPage} user={user} />
      <div className="ml-56 flex-1 flex flex-col min-h-screen overflow-y-auto">
        <PageComponent
          setPage={setPage}
          user={user}
          selectedSpecialist={selectedSpecialist}
          setSelectedSpecialist={setSelectedSpecialist}
          bookingData={bookingData}
          setBookingData={setBookingData}
        />
      </div>
    </div>
  );
}
