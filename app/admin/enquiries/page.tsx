"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminModal } from "@/components/AdminModal";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { AdminFiles } from "@/components/AdminFiles";
import { api, type Application } from "@/lib/api";

type Draft = {
  status: Application["status"];
  type: Application["type"];
  title: string;
  serviceSlug: string;
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  message: string;
  notes: string;
  amount: string;
  partnerCode: string;
  partnerRole: string;
  utr: string;
};

function draftFromApp(a: Application): Draft {
  return {
    status: a.status,
    type: a.type,
    title: a.title || "",
    serviceSlug: a.serviceSlug || "",
    customerName: a.customerName || "",
    mobile: a.mobile || "",
    email: a.email || "",
    address: a.address || "",
    message: a.message || "",
    notes: a.notes || "",
    amount: a.amount == null ? "" : String(a.amount),
    partnerCode: a.partnerCode || "",
    partnerRole: a.partnerRole || "",
    utr: a.utr || "",
  };
}

export default function AdminEnquiriesPage() {
  const { token, user } = useAuth();
  const [apps, setApps] = useState<Application[] | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<Application | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);
  const [deliveryLabel, setDeliveryLabel] = useState("");
  const [deliveryBusy, setDeliveryBusy] = useState(false);
  const canEditAll = user?.role === "admin" || user?.role === "superior";

  async function load() {
    if (!token) return;
    const res = await api.staffApplications(token);
    setApps(res.applications);
  }

  useEffect(() => {
    load().catch(() => setApps([]));
  }, [token]);

  const filtered = useMemo(() => {
    const list = apps || [];
    const query = q.trim().toLowerCase();
    return list.filter((a) => {
      if (type && a.type !== type) return false;
      if (status && a.status !== status) return false;
      if (!query) return true;
      return [
        a.ref,
        a.title,
        a.serviceSlug,
        a.customerName,
        a.mobile,
        a.email,
        a.address,
        a.partnerCode,
        a.utr,
        a.message,
        a.notes,
      ].some((v) => String(v || "").toLowerCase().includes(query));
    });
  }, [apps, q, type, status]);

  function openEdit(a: Application) {
    setError("");
    setOk("");
    setDeliveryLabel("");
    setEditing(a);
    setDraft(draftFromApp(a));
  }

  async function refreshEditing(next: Application) {
    setEditing(next);
    setDraft(draftFromApp(next));
    await load();
  }

  async function onUploadDelivery(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !editing) return;
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    if (deliveryLabel.trim()) form.set("label", deliveryLabel.trim());
    setDeliveryBusy(true);
    setError("");
    setOk("");
    try {
      const res = await api.uploadDelivery(token, editing.id, form);
      formEl.reset();
      setDeliveryLabel("");
      setOk(`Document sent to the customer for ${res.application.ref}.`);
      await refreshEditing(res.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload this document.");
    } finally {
      setDeliveryBusy(false);
    }
  }

  async function onRemoveDelivery(name: string) {
    if (!token || !editing) return;
    setDeliveryBusy(true);
    setError("");
    try {
      const res = await api.deleteDelivery(token, editing.id, name);
      setOk("Issued document removed.");
      await refreshEditing(res.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove this document.");
    } finally {
      setDeliveryBusy(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token || !editing || !draft) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      await api.patchApplication(token, editing.id, {
        status: draft.status,
        type: draft.type,
        title: draft.title,
        serviceSlug: draft.serviceSlug,
        customerName: draft.customerName,
        mobile: draft.mobile,
        email: draft.email,
        address: draft.address,
        message: draft.message,
        notes: draft.notes,
        amount: draft.amount,
        partnerCode: draft.partnerCode,
        partnerRole: draft.partnerRole,
        utr: draft.utr,
      });
      setOk(`${editing.ref} updated.`);
      setEditing(null);
      setDraft(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this application.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="ap-kicker">CMS</div>
      <h1 className="ap-title">Customer enquiries</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        Review customer details, then upload the finished document — trade licence PDF, report, or certificate — so that customer can download it.
      </p>
      {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}
      {ok ? <p style={{ color: "#34d399" }}>{ok}</p> : null}

      <div className="ap-card" style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {([
          ["", "All"],
          ["pending", "New / Pending"],
          ["in_progress", "Processing"],
          ["completed", "Completed"],
          ["rejected", "Rejected"],
        ] as const).map(([value, label]) => (
          <button
            key={value || "all"}
            type="button"
            className={status === value ? "ap-btn" : "ap-btn ghost"}
            onClick={() => setStatus(value)}
          >
            {label}
          </button>
        ))}
        <input className="ap-input" style={{ maxWidth: 260 }} placeholder="Search ref, customer, mobile, UTR" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="ap-select" style={{ maxWidth: 160 }} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="service">Service</option>
          <option value="pvc">PVC</option>
        </select>
        <span className="ap-chip">{filtered.length} shown</span>
      </div>

      <div className="ap-card">
        {!apps ? (
          <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">
            <LottieMark kind="empty" size={140} />
            <p>No customer enquiries in this view yet.</p>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Details</th>
                  <th>Customer files</th>
                  <th>Issued docs</th>
                  <th>Partner</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="ap-ref">{a.ref}</div>
                      <div className="ap-muted">
                        {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                      </div>
                    </td>
                    <td>
                      {a.title}
                      <div className="ap-muted">{a.type}{a.amount != null ? ` · ${a.amount}` : ""}</div>
                    </td>
                    <td>
                      <strong>{a.customerName}</strong>
                      <div className="ap-muted">{a.mobile}</div>
                      <div className="ap-muted">{a.email || "—"}</div>
                      {a.mobile ? (
                        <div className="ap-actions" style={{ marginTop: 6 }}>
                          <a className="ap-btn ghost" href={`https://wa.me/91${String(a.mobile).replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noreferrer">
                            WhatsApp
                          </a>
                          <a className="ap-btn ghost" href={`tel:${a.mobile}`}>Call</a>
                        </div>
                      ) : null}
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      <div>{a.address || "—"}</div>
                      {a.utr ? <div className="ap-muted">UTR {a.utr}</div> : null}
                      {a.message ? <div className="ap-muted">{a.message}</div> : null}
                      {a.notes ? <div className="ap-muted">Note: {a.notes}</div> : null}
                    </td>
                    <td>
                      <AdminFiles files={a.files} empty="—" />
                    </td>
                    <td>
                      <AdminFiles files={a.deliveries} empty="Not sent" />
                    </td>
                    <td>{a.partnerCode || "—"}</td>
                    <td>
                      <select
                        className="ap-select"
                        value={a.status}
                        onChange={async (e) => {
                          if (!token) return;
                          await api.patchApplication(token, a.id, e.target.value);
                          await load();
                        }}
                      >
                        <option value="pending">pending</option>
                        <option value="in_progress">in progress</option>
                        <option value="completed">completed</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                    <td>
                      <button type="button" className="ap-btn ghost" onClick={() => openEdit(a)}>
                        {canEditAll ? "Edit" : "Issue docs"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && draft ? (
        <AdminModal title={`${canEditAll ? "Edit" : "Issue documents"} ${editing.ref}`} onClose={() => { setEditing(null); setDraft(null); }}>
          <form onSubmit={onSave} className="ap-form">
            <div className="ap-form-grid">
              <label>
                Status
                <select className="ap-select" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Application["status"] })}>
                  <option value="pending">pending</option>
                  <option value="in_progress">in progress</option>
                  <option value="completed">completed</option>
                  <option value="rejected">rejected</option>
                </select>
              </label>
              {canEditAll ? (
                <>
                  <label>
                    Type
                    <select className="ap-select" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Application["type"] })}>
                      <option value="service">service</option>
                      <option value="pvc">pvc</option>
                    </select>
                  </label>
                  <label>
                    Title
                    <input className="ap-input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                  </label>
                  <label>
                    Service slug
                    <input className="ap-input" value={draft.serviceSlug} onChange={(e) => setDraft({ ...draft, serviceSlug: e.target.value })} />
                  </label>
                  <label>
                    Customer name
                    <input className="ap-input" required value={draft.customerName} onChange={(e) => setDraft({ ...draft, customerName: e.target.value })} />
                  </label>
                  <label>
                    Mobile
                    <input className="ap-input" required value={draft.mobile} onChange={(e) => setDraft({ ...draft, mobile: e.target.value })} />
                  </label>
                  <label>
                    Email
                    <input className="ap-input" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                  </label>
                  <label>
                    Amount
                    <input className="ap-input" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
                  </label>
                  <label>
                    Partner code
                    <input className="ap-input" value={draft.partnerCode} onChange={(e) => setDraft({ ...draft, partnerCode: e.target.value })} />
                  </label>
                  <label>
                    Partner role
                    <input className="ap-input" value={draft.partnerRole} onChange={(e) => setDraft({ ...draft, partnerRole: e.target.value })} />
                  </label>
                  <label>
                    UTR
                    <input className="ap-input" value={draft.utr} onChange={(e) => setDraft({ ...draft, utr: e.target.value })} />
                  </label>
                </>
              ) : (
                <label>
                  Customer
                  <input className="ap-input" value={`${draft.customerName} · ${draft.mobile}`} readOnly />
                </label>
              )}
            </div>
            {canEditAll ? (
              <>
                <label>
                  Address
                  <textarea className="ap-textarea" rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
                </label>
                <label>
                  Message
                  <textarea className="ap-textarea" rows={3} value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} />
                </label>
              </>
            ) : null}
            <label>
              Staff notes
              <textarea className="ap-textarea" rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Shown to the customer on Track Status." />
            </label>
            <div>
              <div className="ap-label">Customer uploads</div>
              <AdminFiles files={editing.files} empty="Customer did not attach files." />
            </div>
            <div className="ap-actions">
              <button className="ap-btn" disabled={saving}>{saving ? "Saving..." : "Save application"}</button>
              <button type="button" className="ap-btn ghost" onClick={() => { setEditing(null); setDraft(null); }}>Close</button>
            </div>
          </form>

          <form onSubmit={onUploadDelivery} className="ap-form" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid #e2e8f0" }}>
            <div className="ap-label">Issue completed documents</div>
            <p className="ap-muted" style={{ margin: "6px 0 12px" }}>
              Upload the finished file for this application — for example the trade licence PDF. Only this customer can see it on Track Status and their dashboard.
            </p>
            <AdminFiles files={editing.deliveries} empty="No document issued yet." onRemove={onRemoveDelivery} />
            <label>
              Document name
              <input
                className="ap-input"
                value={deliveryLabel}
                onChange={(e) => setDeliveryLabel(e.target.value)}
                placeholder="Trade licence PDF"
              />
            </label>
            <label>
              File
              <input className="ap-input" type="file" name="deliveries" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" multiple required />
            </label>
            <div className="ap-actions">
              <button className="ap-btn" disabled={deliveryBusy}>{deliveryBusy ? "Sending..." : "Send to customer"}</button>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </AdminShell>
  );
}
