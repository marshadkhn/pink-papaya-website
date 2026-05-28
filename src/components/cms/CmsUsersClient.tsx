"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CmsToast, useCmsToast } from "@/components/cms/CmsToast";

type UserRow = {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "content_manager";
  createdBy: string | null;
  createdAt: string;
};

const ROLE_OPTIONS: Array<{ value: UserRow["role"]; label: string }> = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "content_manager", label: "Content Manager" },
];

export default function CmsUsersClient({ permissions }: { permissions: string[] }) {
  const canWrite = permissions.includes("cms.users.write");
  const { toast, show } = useCmsToast();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/users");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load users");
      setUsers(json.users ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => u.email.toLowerCase().includes(s) || u.role.toLowerCase().includes(s));
  }, [q, users]);

  async function createUser() {
    if (!canWrite) {
      show({ type: "error", message: "You don’t have permission to manage users." });
      return;
    }

    const email = (emailRef.current?.value ?? "").trim();
    const password = passwordRef.current?.value ?? "";
    const role = (roleRef.current?.value ?? "editor") as UserRow["role"];

    if (!email || !password) {
      show({ type: "error", message: "Email and password are required." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/cms/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to create user");

      show({ type: "success", message: "User created" });
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
      if (roleRef.current) roleRef.current.value = "editor";
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Create failed" });
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(id: string, role: UserRow["role"]) {
    if (!canWrite) {
      show({ type: "error", message: "You don’t have permission to manage users." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/cms/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to update role");
      show({ type: "success", message: "Role updated" });
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Update failed" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string, email: string) {
    if (!canWrite) {
      show({ type: "error", message: "You don’t have permission to manage users." });
      return;
    }
    if (!confirm(`Delete user ${email}?`)) return;

    setSaving(true);
    try {
      const res = await fetch("/api/cms/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to delete user");
      show({ type: "success", message: "User deleted" });
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Delete failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <CmsToast toast={toast} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
            <h3 className="font-semibold text-neutral-900 mb-5 font-bricolage">New user</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">Email</label>
                <Input ref={emailRef} type="email" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">Password</label>
                <Input ref={passwordRef} type="password" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-bricolage">Role</label>
                <Select ref={roleRef} defaultValue="editor">
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </Select>
              </div>

              <Button onClick={createUser} disabled={!canWrite || saving} className="w-full">
                {saving ? "Working…" : "Create user"}
              </Button>

              {!canWrite && (
                <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm text-neutral-500 font-bricolage">
                  Read-only: your role can’t manage users.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-sm">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" />
            </div>
            <button onClick={load} className="text-sm font-bricolage text-neutral-500 hover:text-neutral-900 transition">Refresh</button>
          </div>

          {loading ? (
            <p className="text-neutral-400 font-bricolage py-6">Loading…</p>
          ) : error ? (
            <p className="text-red-500 font-bricolage py-6">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-neutral-400 font-bricolage py-6">No users found.</p>
          ) : (
            <div className="border rounded-xl overflow-hidden bg-white">
              <table className="w-full text-sm font-bricolage">
                <thead className="bg-neutral-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Created</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-4 text-neutral-800 font-medium">{u.email}</td>
                      <td className="px-5 py-4">
                        <Select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value as any)}
                          disabled={!canWrite || saving}
                          className="h-9"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-5 py-4 text-neutral-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => remove(u.id, u.email)}
                          disabled={!canWrite || saving}
                          className="text-xs text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
