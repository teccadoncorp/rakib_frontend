"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminModal } from "@/components/AdminModal";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { AdminFiles } from "@/components/AdminFiles";
import { api, type User } from "@/lib/api";
import { roleLabel, type Role } from "@/lib/roles";

type Draft = {
  name: string;
  mobile: string;
  email: string;
  address: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  partnerCode: string;
  userCode: string;
  parentId: string;
  password: string;
  emailVerified: boolean;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  role: "user",
  status: "active",
  partnerCode: "",
  userCode: "",
  parentId: "",
  password: "",
  emailVerified: false,
};

function draftFromUser(u: User): Draft {
  return {
    name: u.name || "",
    mobile: u.mobile || "",
    email: u.email || "",
    address: u.address || "",
    role: u.role,
    status: u.status || "active",
    partnerCode: u.partnerCode || "",
    userCode: u.userCode || "",
    parentId: u.parentId || "",
    password: "",
    emailVerified: Boolean(u.emailVerified),
  };
}

export default function AdminUsersPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [superiorSecret, setSuperiorSecret] = useState("");
  const isAdmin = user?.role === "admin";
  const canEdit = user?.role === "admin" || user?.role === "superior";

  async function load() {
    if (!token) return;
    const res = await api.staffUsers(token);
    setUsers(res.users);
  }

  useEffect(() => {
    load().catch(() => setUsers([]));
  }, [token]);

  const counts = useMemo(() => {
    const list = users || [];
    return {
      all: list.length,
      user: list.filter((u) => u.role === "user").length,
      retailer: list.filter((u) => u.role === "retailer").length,
      distributor: list.filter((u) => u.role === "distributor").length,
      superior: list.filter((u) => u.role === "superior").length,
      admin: list.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  const filtered = useMemo(() => {
    const list = users || [];
    const query = q.trim().toLowerCase();
    return list.filter((u) => {
      if (role && u.role !== role) return false;
      if (!query) return true;
      return [u.name, u.email, u.mobile, u.userCode, u.partnerCode, u.role, u.address].some((v) =>
        String(v || "").toLowerCase().includes(query)
      );
    });
  }, [users, q, role]);

  const distributors = (users || []).filter((u) => u.role === "distributor");

  function openCreate() {
    setError("");
    setOk("");
    setDraft({ ...EMPTY_DRAFT, role: "user", status: "active" });
    setCreating(true);
  }

  function openEdit(next: User) {
    setError("");
    setOk("");
    setEditing(next);
    setDraft(draftFromUser(next));
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!token || !editing) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      const payload: Record<string, string> = {
        name: draft.name,
        mobile: draft.mobile,
        email: draft.email,
        address: draft.address,
        status: draft.status,
        emailVerified: draft.emailVerified ? "true" : "false",
        parentId: draft.parentId,
      };
      if (isAdmin) {
        payload.role = draft.role;
        payload.partnerCode = draft.partnerCode;
        payload.userCode = draft.userCode;
        if (draft.password) payload.password = draft.password;
      }
      await api.patchUser(token, editing.id, payload);
      setOk(`${draft.name} updated.`);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this account.");
    } finally {
      setSaving(false);
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      await api.createStaffUser(
        token,
        {
          name: draft.name,
          mobile: draft.mobile,
          email: draft.email,
          address: draft.address,
          role: draft.role,
          status: draft.password ? "active" : draft.status,
          password: draft.password,
          parentId: draft.parentId,
          partnerCode: draft.partnerCode,
        },
        draft.role === "superior" ? superiorSecret : undefined
      );
      setOk(`${draft.name} is now on the directory.`);
      setCreating(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create this account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="ap-kicker">Directory</div>
      <h1 className="ap-title">People</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        Every signed-up customer, retailer, distributor and staff account appears here. Admins can edit the full record.
      </p>
      {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}
      {ok ? <p style={{ color: "#34d399" }}>{ok}</p> : null}

      <div className="ap-stats">
        <button type="button" className={`ap-stat${role === "" ? " on" : ""}`} onClick={() => setRole("")}>
          All <strong>{counts.all}</strong>
        </button>
        <button type="button" className={`ap-stat${role === "user" ? " on" : ""}`} onClick={() => setRole("user")}>
          Users <strong>{counts.user}</strong>
        </button>
        <button type="button" className={`ap-stat${role === "retailer" ? " on" : ""}`} onClick={() => setRole("retailer")}>
          Retailers <strong>{counts.retailer}</strong>
        </button>
        <button type="button" className={`ap-stat${role === "distributor" ? " on" : ""}`} onClick={() => setRole("distributor")}>
          Distributors <strong>{counts.distributor}</strong>
        </button>
        <button type="button" className={`ap-stat${role === "superior" ? " on" : ""}`} onClick={() => setRole("superior")}>
          Superiors <strong>{counts.superior}</strong>
        </button>
        <button type="button" className={`ap-stat${role === "admin" ? " on" : ""}`} onClick={() => setRole("admin")}>
          Admins <strong>{counts.admin}</strong>
        </button>
      </div>

      <div className="ap-card" style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input className="ap-input" style={{ maxWidth: 280 }} placeholder="Search name, mobile, code, address" value={q} onChange={(e) => setQ(e.target.value)} />
        {isAdmin ? (
          <button type="button" className="ap-btn" onClick={openCreate}>
            Add person
          </button>
        ) : null}
      </div>

      <div className="ap-card">
        {!users ? (
          <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">
            <LottieMark kind="empty" size={140} />
            <p>No people in this view yet.</p>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Codes</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Files</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div className="ap-muted">{u.userCode || "—"}</div>
                    </td>
                    <td>
                      <span className={`ap-role ${u.role}`}>{roleLabel(u.role)}</span>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{u.partnerCode || "—"}</td>
                    <td>
                      {u.mobile}
                      <div className="ap-muted">{u.email || "—"}</div>
                    </td>
                    <td style={{ maxWidth: 180 }}>{u.address || "—"}</td>
                    <td>
                      <AdminFiles files={u.files} empty="—" />
                    </td>
                    <td>
                      <select
                        className="ap-select"
                        value={u.status || "active"}
                        onChange={async (e) => {
                          if (!token) return;
                          await api.patchUser(token, u.id, { status: e.target.value });
                          await load();
                        }}
                      >
                        <option value="active">active</option>
                        <option value="invited">invited</option>
                        <option value="suspended">suspended</option>
                      </select>
                    </td>
                    <td>
                      {canEdit ? (
                        <button type="button" className="ap-btn ghost" onClick={() => openEdit(u)}>
                          Edit
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing ? (
        <AdminModal title={`Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <form onSubmit={onSaveEdit} className="ap-form">
            <PersonFields
              draft={draft}
              setDraft={setDraft}
              distributors={distributors}
              isAdmin={isAdmin}
              passwordHint="Leave blank to keep the current password"
            />
            <div>
              <div className="ap-label">Uploaded files</div>
              <AdminFiles files={editing.files} />
            </div>
            <div className="ap-actions">
              <button className="ap-btn" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
              <button type="button" className="ap-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {creating ? (
        <AdminModal title="Add person" onClose={() => setCreating(false)}>
          <form onSubmit={onCreate} className="ap-form">
            <PersonFields
              draft={draft}
              setDraft={setDraft}
              distributors={distributors}
              isAdmin
              passwordHint="Set a password to activate immediately, or leave blank to mark invited"
              superiorSecret={superiorSecret}
              setSuperiorSecret={setSuperiorSecret}
            />
            <div className="ap-actions">
              <button className="ap-btn" disabled={saving}>{saving ? "Creating..." : "Create account"}</button>
              <button type="button" className="ap-btn ghost" onClick={() => setCreating(false)}>Cancel</button>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </AdminShell>
  );
}

function PersonFields({
  draft,
  setDraft,
  distributors,
  isAdmin,
  passwordHint,
  superiorSecret,
  setSuperiorSecret,
}: {
  draft: Draft;
  setDraft: (next: Draft) => void;
  distributors: User[];
  isAdmin: boolean;
  passwordHint: string;
  superiorSecret?: string;
  setSuperiorSecret?: (value: string) => void;
}) {
  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft({ ...draft, [key]: value });
  }
  return (
    <>
      <label>
        Full name
        <input className="ap-input" required value={draft.name} onChange={(e) => set("name", e.target.value)} />
      </label>
      <label>
        Mobile
        <input className="ap-input" required value={draft.mobile} onChange={(e) => set("mobile", e.target.value)} />
      </label>
      <label>
        Email
        <input className="ap-input" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
      </label>
      <label>
        Address
        <input className="ap-input" value={draft.address} onChange={(e) => set("address", e.target.value)} />
      </label>
      {isAdmin ? (
        <label>
          Role
          <select className="ap-select" value={draft.role} onChange={(e) => set("role", e.target.value as Role)}>
            <option value="user">User</option>
            <option value="retailer">Retailer</option>
            <option value="distributor">Distributor</option>
            <option value="superior">Superior</option>
            {draft.role === "admin" ? <option value="admin">Admin</option> : null}
          </select>
        </label>
      ) : (
        <p className="ap-sub">Role: {roleLabel(draft.role)}</p>
      )}
      <label>
        Status
        <select className="ap-select" value={draft.status} onChange={(e) => set("status", e.target.value as Draft["status"])}>
          <option value="active">active</option>
          <option value="invited">invited</option>
          <option value="suspended">suspended</option>
        </select>
      </label>
      {isAdmin ? (
        <>
          <label>
            User code
            <input className="ap-input" value={draft.userCode} onChange={(e) => set("userCode", e.target.value)} />
          </label>
          <label>
            Partner code
            <input className="ap-input" value={draft.partnerCode} onChange={(e) => set("partnerCode", e.target.value)} />
          </label>
        </>
      ) : null}
      {draft.role === "retailer" ? (
        <label>
          Parent distributor
          <select className="ap-select" value={draft.parentId} onChange={(e) => set("parentId", e.target.value)}>
            <option value="">None</option>
            {distributors.map((d) => (
              <option key={d.id} value={d.id}>{d.name} · {d.partnerCode}</option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="ap-check">
        <input type="checkbox" checked={draft.emailVerified} onChange={(e) => set("emailVerified", e.target.checked)} />
        Email verified
      </label>
      {isAdmin && draft.role === "superior" && setSuperiorSecret ? (
        <label>
          Superior create secret
          <input className="ap-input" type="password" value={superiorSecret || ""} onChange={(e) => setSuperiorSecret(e.target.value)} required />
        </label>
      ) : null}
      {isAdmin ? (
        <label>
          Password
          <input className="ap-input" type="password" value={draft.password} onChange={(e) => set("password", e.target.value)} placeholder={passwordHint} />
        </label>
      ) : null}
    </>
  );
}
