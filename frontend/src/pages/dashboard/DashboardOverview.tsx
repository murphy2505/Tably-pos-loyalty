// frontend/src/pages/dashboard/DashboardOverview.tsx

import { Link } from "react-router-dom";

const DashboardOverview = () => {
  return (
    <div className="p-4 text-slate-100">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <p className="text-slate-400 mb-6">
        Overzicht van modules en activiteiten voor deze locatie.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/pos"
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition border border-slate-700"
        >
          <h2 className="text-lg font-medium">POS</h2>
          <p className="text-sm text-slate-400">Kassa en bestellingen beheren.</p>
        </Link>

        <Link
          to="/pos/kds"
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition border border-slate-700"
        >
          <h2 className="text-lg font-medium">KDS</h2>
          <p className="text-sm text-slate-400">Keuken tickets bekijken.</p>
        </Link>

        <Link
          to="/loyalty"
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition border border-slate-700"
        >
          <h2 className="text-lg font-medium">Loyalty</h2>
          <p className="text-sm text-slate-400">Spaarkaarten en klantenbeheer.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardOverview;
