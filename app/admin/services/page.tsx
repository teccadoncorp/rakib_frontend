"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminModal } from "@/components/AdminModal";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type CatalogService } from "@/lib/api";
import { emptyDoc, FALLBACK_CATALOG } from "@/lib/catalog";
import { formatInr, type ServiceDoc } from "@/lib/data";

type Draft = {
  id?: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  overview: string;
  icon: string;
  processingTime: string;
  price: string;
  priceLabel: string;
  priceDisplay: string;
  requiresPartner: boolean;
  active: boolean;
  sortOrder: string;
  retailerFee: string;
  distributorFee: string;
  priceDisplayType: string;
  roleOption: string;
  documents: ServiceDoc[];
};

function draftFrom(service?: CatalogService | null): Draft {
  return {
    id: service?.id,
    slug: service?.slug || "",
    title: service?.title || "",
    shortTitle: service?.shortTitle || "",
    description: service?.description || "",
    overview: service?.overview || "",
    icon: service?.icon || "fa-briefcase",
    processingTime: service?.processingTime || "Instant",
    price: service?.price == null ? "" : String(service.price),
    priceLabel: service?.priceLabel || "",
    priceDisplay: service?.priceDisplay || "",
    requiresPartner: Boolean(service?.requiresPartner),
    active: service ? service.active !== false : true,
    sortOrder: String(service?.sortOrder ?? 0),
    retailerFee: service?.retailerFee == null ? "" : String(service.retailerFee),
    distributorFee: service?.distributorFee == null ? "" : String(service.distributorFee),
    priceDisplayType: service?.priceDisplayType || (service?.price == null ? "contact" : "starting"),
    roleOption: service?.roleOption || (service?.requiresPartner ? "both" : "hidden"),
    documents: service?.documents?.length ? service.documents.map((doc) => ({ ...doc })) : [],
  };
}

export default function AdminServicesPage() {
  const { token, user } = useAuth();
  const [services, setServices] = useState<CatalogService[]>(FALLBACK_CATALOG);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const canEdit = user?.role === "admin" || user?.role === "superior";

  async function load() {
    if (!token) {
      setServices(FALLBACK_CATALOG);
      setUsingFallback(true);
      return;
    }
    try {
      const res = await api.staffServices(token);
      const list = Array.isArray(res.services) ? res.services : [];
      if (list.length) {
        setServices(list);
        setUsingFallback(false);
        setError("");
      } else {
        setServices(FALLBACK_CATALOG);
        setUsingFallback(true);
      }
    } catch (err) {
      setServices(FALLBACK_CATALOG);
      setUsingFallback(true);
      setError(err instanceof Error ? err.message : "Could not load the live catalog. Showing the built-in services.");
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const list = services || [];
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((s) =>
      [s.title, s.slug, s.description, s.overview].some((v) => String(v || "").toLowerCase().includes(query))
    );
  }, [services, q]);

  function payloadFrom(draft: Draft) {
    return {
      slug: draft.slug,
      title: draft.title,
      shortTitle: draft.shortTitle,
      description: draft.description,
      overview: draft.overview,
      icon: draft.icon,
      processingTime: draft.processingTime,
      price: draft.price,
      priceLabel: draft.priceLabel,
      priceDisplay: draft.priceDisplay,
      requiresPartner: draft.requiresPartner,
      active: draft.active,
      sortOrder: Number(draft.sortOrder || 0),
      retailerFee: draft.retailerFee,
      distributorFee: draft.distributorFee,
      priceDisplayType: draft.priceDisplayType,
      roleOption: draft.roleOption,
      documents: draft.documents.filter((doc) => doc.name.trim()),
    };
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token || !editing) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      if (editing.id) {
        await api.patchService(token, editing.id, payloadFrom(editing));
        setOk(`${editing.title} updated. The public site and customer apply form now use this content.`);
      } else {
        await api.createService(token, payloadFrom(editing));
        setOk(`${editing.title} added to the live catalog.`);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this service.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(service: CatalogService) {
    if (!token || !canEdit) return;
    if (!confirm(`Remove ${service.title} from the website catalog? Existing enquiries stay in Customer enquiries.`)) return;
    try {
      await api.deleteService(token, service.id);
      setOk(`${service.title} removed.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this service.");
    }
  }

  function updateDoc(index: number, patch: Partial<ServiceDoc>) {
    if (!editing) return;
    const documents = editing.documents.map((doc, i) => (i === index ? { ...doc, ...patch } : doc));
    setEditing({ ...editing, documents });
  }

  return (
    <AdminShell>
      <div className="ap-kicker">CMS</div>
      <h1 className="ap-title">Services & docs</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        This catalog is the CMS for the public website, apply form, and customer dashboard. Titles, prices, partner gates, and required documents all come from here.
      </p>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {usingFallback ? (
        <p className="ap-sub" style={{ marginBottom: 12 }}>
          Showing the built-in catalog. Save a service once the API is connected to store it in the CMS.
        </p>
      ) : null}
      {ok ? <p style={{ color: "#047857" }}>{ok}</p> : null}

      <div className="ap-card" style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input className="ap-input" style={{ maxWidth: 280 }} placeholder="Search title, slug, or copy" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="ap-chip">{filtered.length} services</span>
        {canEdit ? (
          <button type="button" className="ap-btn" onClick={() => { setError(""); setOk(""); setEditing(draftFrom()); }}>
            Add service
          </button>
        ) : (
          <span className="ap-muted">Only admin and superior can edit the catalog.</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="ap-empty">
          <LottieMark kind="empty" size={140} />
          <p>No services match this search. Clear the filter or add a service.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((s, i) => (
            <div key={s.id} className="ap-card" style={{ animationDelay: `${i * 40}ms`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <strong>{s.title}</strong>
                <div className="ap-muted">/{s.slug} · {(s.documents || []).length} document{(s.documents || []).length === 1 ? "" : "s"}</div>
                <p className="ap-sub" style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>{s.description}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {s.active === false ? <span className="ap-chip">Hidden</span> : <span className="ap-chip">Live</span>}
                  {s.requiresPartner ? <span className="ap-chip">Needs retailer / distributor ID</span> : null}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: "#0d6efd" }}>{s.price ? formatInr(s.price) : s.priceDisplay || "As Applicable"}</div>
                <div className="ap-muted">{s.processingTime}</div>
                {canEdit ? (
                  <div className="ap-actions" style={{ justifyContent: "flex-end" }}>
                    <button type="button" className="ap-btn ghost" onClick={() => { setError(""); setOk(""); setEditing(draftFrom(s)); }}>
                      Edit
                    </button>
                    <button type="button" className="ap-btn danger" onClick={() => onDelete(s)}>
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <AdminModal title={editing.id ? `Edit ${editing.title || "service"}` : "Add service"} onClose={() => setEditing(null)}>
          <form onSubmit={onSave} className="ap-form">
            <div className="ap-form-grid">
              <label>
                Title
                <input className="ap-input" required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </label>
              <label>
                URL slug
                <input className="ap-input" placeholder="gst-registration" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </label>
              <label>
                Short title
                <input className="ap-input" value={editing.shortTitle} onChange={(e) => setEditing({ ...editing, shortTitle: e.target.value })} />
              </label>
              <label>
                Icon class
                <input className="ap-input" placeholder="fa-file-invoice" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
              </label>
              <label>
                Processing time
                <input className="ap-input" value={editing.processingTime} onChange={(e) => setEditing({ ...editing, processingTime: e.target.value })} />
              </label>
              <label>
                Price (INR)
                <input className="ap-input" inputMode="decimal" placeholder="Leave empty for quote" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
              </label>
              <label>
                Price label
                <input className="ap-input" value={editing.priceLabel} onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value })} />
              </label>
              <label>
                Price display
                <input className="ap-input" value={editing.priceDisplay} onChange={(e) => setEditing({ ...editing, priceDisplay: e.target.value })} />
              </label>
              <label>
                Sort order
                <input className="ap-input" value={editing.sortOrder} onChange={(e) => setEditing({ ...editing, sortOrder: e.target.value })} />
              </label>
              <label>
                Retailer fee (INR)
                <input className="ap-input" inputMode="decimal" value={editing.retailerFee} onChange={(e) => setEditing({ ...editing, retailerFee: e.target.value })} />
              </label>
              <label>
                Distributor fee (INR)
                <input className="ap-input" inputMode="decimal" value={editing.distributorFee} onChange={(e) => setEditing({ ...editing, distributorFee: e.target.value })} />
              </label>
              <label>
                Price display
                <select className="ap-select" value={editing.priceDisplayType} onChange={(e) => setEditing({ ...editing, priceDisplayType: e.target.value })}>
                  <option value="contact">Contact for Price</option>
                  <option value="starting">Starting At</option>
                  <option value="fixed">Fixed Price</option>
                </select>
              </label>
              <label>
                Role selection
                <select className="ap-select" value={editing.roleOption} onChange={(e) => setEditing({ ...editing, roleOption: e.target.value })}>
                  <option value="both">Both retailer & distributor</option>
                  <option value="hidden">Hide role selection</option>
                </select>
              </label>
            </div>
            <label>
              Short description
              <textarea className="ap-textarea" rows={2} required value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </label>
            <label>
              Overview (website + dashboard)
              <textarea className="ap-textarea" rows={4} value={editing.overview} onChange={(e) => setEditing({ ...editing, overview: e.target.value })} />
            </label>
            <label className="ap-check">
              <input type="checkbox" checked={editing.requiresPartner} onChange={(e) => setEditing({ ...editing, requiresPartner: e.target.checked })} />
              Requires retailer / distributor ID
            </label>
            <label className="ap-check">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              Published on website and customer apply form
            </label>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div className="ap-label">Required documents</div>
                <button type="button" className="ap-btn ghost" onClick={() => setEditing({ ...editing, documents: [...editing.documents, emptyDoc()] })}>
                  Add document
                </button>
              </div>
              {editing.documents.length === 0 ? (
                <p className="ap-muted">No uploads required. Customers only fill name, mobile, and address.</p>
              ) : (
                <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
                  {editing.documents.map((doc, index) => (
                    <div key={`${doc.name}-${index}`} className="ap-card" style={{ padding: 14 }}>
                      <div className="ap-form-grid">
                        <label>
                          Document name
                          <input className="ap-input" value={doc.name} onChange={(e) => updateDoc(index, { name: e.target.value })} />
                        </label>
                        <label>
                          Allowed formats
                          <input className="ap-input" value={doc.formats} onChange={(e) => updateDoc(index, { formats: e.target.value })} />
                        </label>
                        <label>
                          File extensions
                          <input className="ap-input" value={doc.allowed} onChange={(e) => updateDoc(index, { allowed: e.target.value })} />
                        </label>
                        <label>
                          Max size (MB)
                          <input className="ap-input" value={String(doc.maxMb)} onChange={(e) => updateDoc(index, { maxMb: Number(e.target.value) || 5 })} />
                        </label>
                      </div>
                      <label>
                        Hint for the customer
                        <input className="ap-input" value={doc.hint} onChange={(e) => updateDoc(index, { hint: e.target.value })} />
                      </label>
                      <div className="ap-actions">
                        <label className="ap-check">
                          <input type="checkbox" checked={doc.required} onChange={(e) => updateDoc(index, { required: e.target.checked })} />
                          Mandatory
                        </label>
                        <button
                          type="button"
                          className="ap-btn danger"
                          onClick={() => setEditing({ ...editing, documents: editing.documents.filter((_, i) => i !== index) })}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ap-actions">
              <button className="ap-btn" disabled={saving}>{saving ? "Saving..." : "Save service"}</button>
              <button type="button" className="ap-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </AdminShell>
  );
}
