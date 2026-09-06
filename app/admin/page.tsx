"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type StaffOverview } from "@/lib/api";
import { roleLabel } from "@/lib/roles";

const EMPTY: StaffOverview = {
  users: 0,
  distributors: 0,
  retailers: 0,
  applications: 0,
  pending: 0,
  completed: 0,
  interests: 0,
  contacts: 0,
};

export default function AdminHome() {
  const { token, user } = useAuth();
  const [data, setData] = useState<StaffOverview | null>(null);

  useEffect(() => {
    if (!token) return;
    api.staffOverview(token).then((res) => setData(res.overview)).catch(() => setData(EMPTY));
  }, [token]);

  return (
    <AdminShell>
      <div className="ap-kicker">Live network</div>
      <h1 className="ap-title">Good to see you, {user?.name.split(" ")[0]}</h1>
      <p className="ap-sub" style={{ marginBottom: 22 }}>
        {roleLabel(user?.role)} workspace for Digital Service — site settings, services & docs, customer enquiries, and the partner network.
      </p>
      {!data ? (
        <div className="ap-empty">
          <LottieMark kind="loader" size={130} />
        </div>
      ) : (
        <div className="ap-grid">
          <Kpi label="Customers" value={data.users} icon="fa-user" />
          <Kpi label="Distributors" value={data.distributors} icon="fa-sitemap" />
          <Kpi label="Retailers" value={data.retailers} icon="fa-shop" />
          <Kpi label="Customer enquiries" value={data.applications} icon="fa-folder-open" />
          <Kpi label="In motion" value={data.pending} icon="fa-bolt" />
          <Kpi label="Completed" value={data.completed} icon="fa-circle-check" />
          <Kpi label="Open interests" value={data.interests} icon="fa-hand" />
          <Kpi label="Inbox" value={data.contacts} icon="fa-inbox" />
        </div>
      )}
    </AdminShell>
  );
}

function Kpi({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="ap-card">
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#e0f2fe", color: "#0369a1", display: "grid", placeItems: "center", marginBottom: 12 }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="ap-label">{label}</div>
      <div className="ap-kpi">{value}</div>
    </div>
  );
}
