import { useState, useMemo } from "react";
import PageHeader from "../components/layout/PageHeader";
import PageContainer from "../components/layout/PageContainer";
import SpecialistCard from "../components/cards/SpecialistCard";
import SelectableChip from "../components/booking/SelectableChip";
import Icon from "../components/ui/Icon";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { useSpecialists } from "../hooks/useApi";
import { SPECIALTIES } from "../data/mockData";

const FindSpecialist = ({ setPage, setSelectedSpecialist }) => {
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { specialists, loading, error } = useSpecialists();

  const filtered = useMemo(() => {
    return specialists.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.specialty.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        activeFilter === "All" ||
        s.specialty.toLowerCase().includes(activeFilter.toLowerCase()) ||
        s.category?.toLowerCase() === activeFilter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [specialists, search, activeFilter]);

  const handleSelect = (specialist) => {
    setSelectedSpecialist(specialist);
    setPage("slots");
  };

  return (
    <>
      <PageHeader title="Book an appointment" />

      <PageContainer>
        <div className="mb-10 space-y-4">
          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by specialty or doctor name…"
              className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SPECIALTIES.map((s) => (
              <SelectableChip
                key={s}
                label={s}
                active={activeFilter === s}
                onClick={() => setActiveFilter(s)}
              />
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center py-10">
            Failed to load specialists. Please try again.
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon="person_search"
            title="No specialists found"
            description="Try adjusting your search or filter."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((spec) => (
              <SpecialistCard key={spec.id} specialist={spec} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default FindSpecialist;
