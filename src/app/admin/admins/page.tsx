"use client";

import { useEffect, useRef, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";

type Admin = {
  id: string;
  email: string;
  role: string;
  createdBy?: string;
  createdAt: string;
};

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function fetchAdmins() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins");
      if (!res.ok) throw new Error("Failed to load admins");
      const data = await res.json();
      setAdmins(data.admins ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAdmins(); }, []);

  async function handleAdd() {
    const email = (emailRef.current?.value ?? "").trim();
    const password = passwordRef.current?.value ?? "";
    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }
    setFormError(null);
    setAdding(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Failed to add admin");
        return;
      }
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
      setShowForm(false);
      await fetchAdmins();
    } catch (e: any) {
      setFormError(e?.message ?? "Failed to add admin");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Remove admin ${email}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to delete admin");
        return;
      }
      await fetchAdmins();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete admin");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
        <AdminPageHeader
          title="Admins"
          description="Add or remove admin portal accounts."
          actions={
            <Button onClick={() => { setShowForm(!showForm); setFormError(null); }}>
              {showForm ? "Cancel" : "+ Add Admin"}
            </Button>
          }
        />

        {/* Add admin form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl border border-neutral-200/80 p-6 max-w-md">
            <h3 className="font-semibold text-neutral-900 mb-5 font-bricolage">New Admin</h3>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-bricolage">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#9A6648]/30 focus:border-[#9A6648] transition font-bricolage"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">
                  Password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#9A6648]/30 focus:border-[#9A6648] transition font-bricolage"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <Button onClick={handleAdd} disabled={adding} className="w-full">
                {adding ? "Adding…" : "Add Admin"}
              </Button>
            </div>
          </div>
        )}

        {/* Admin list */}
        {loading ? (
          <p className="text-neutral-400 font-bricolage py-8">Loading…</p>
        ) : error ? (
          <p className="text-red-500 font-bricolage py-8">{error}</p>
        ) : admins.length === 0 ? (
          <p className="text-neutral-400 font-bricolage py-8">No admins found.</p>
        ) : (
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm font-bricolage">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Added by
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Created
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4 text-neutral-800 font-medium">{admin.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block text-[11px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-[#9A6648]/10 text-[#9A6648]">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-500">
                      {admin.createdBy ?? <span className="text-neutral-300 italic">system</span>}
                    </td>
                    <td className="px-5 py-4 text-neutral-400">
                      {new Date(admin.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(admin.id, admin.email)}
                        disabled={deletingId === admin.id || admins.length === 1}
                        className="text-xs text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
                        title={admins.length === 1 ? "Cannot delete the last admin" : "Remove admin"}
                      >
                        {deletingId === admin.id ? "Removing…" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  );
}
