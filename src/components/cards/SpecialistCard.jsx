import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const SpecialistCard = ({ specialist, onSelect }) => {
  const { name, specialty, available } = specialist;
  const initials = name.split(" ").slice(1).map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 flex flex-col items-center text-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
      <div className="relative">
        <Avatar initials={initials} size="xl" />
        {available && (
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight">{name}</h3>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">{specialty}</p>
      </div>
      <Badge variant={available ? "green" : "slate"} dot>
        {available ? "Available today" : "Unavailable"}
      </Badge>
      <Button variant="outline" size="full" onClick={() => onSelect(specialist)} disabled={!available}>
        Select
      </Button>
    </div>
  );
};

export default SpecialistCard;
