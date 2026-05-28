"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CmsToast, useCmsToast } from "@/components/cms/CmsToast";

type RoleKey = "super_admin" | "admin" | "editor" | "content_manager";

type Role = {
  key: RoleKey;
  name: string;
  permissionKeys: string[];
};

type Permission = {
  key: string;
  label: string;
  description?: string;
};

export default function CmsRolesClient({ permissions, role }: { permissions: string[]; role: string | null }) {
  const canWrite = permissions.includes("cms.roles.write") && role === "super_admin";
  const { toast, show } = useCmsToast();

  const [roles, setRoles] = useState<Role[]>([]);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<RoleKey>("admin");
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [rRes, pRes] = await Promise.all([fetch("/api/cms/roles"), fetch("/api/cms/permissions")]);
      const rJson = await rRes.json();
      const pJson = await pRes.json();
      if (!rRes.ok) throw new Error(rJson?.error ?? "Failed to load roles");
      if (!pRes.ok) throw new Error(pJson?.error ?? "Failed to load permissions");

      setRoles(rJson.roles ?? []);
      setPerms(pJson.permissions ?? []);

      const initialRole = (rJson.roles ?? []).find((x: Role) => x.key === selectedKey) ?? (rJson.roles ?? [])[0];
      if (initialRole) {
        setSelectedKey(initialRole.key);
        setDraft(new Set(initialRole.permissionKeys ?? []));
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useMemo(() => roles.find((r) => r.key === selectedKey) ?? null, [roles, selectedKey]);

  useEffect(() => {
    if (!selected) return;
    setDraft(new Set(selected.permissionKeys ?? []));
  }, [selected]);

  function toggle(key: string) {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function save() {
    if (!canWrite) {
      show({ type: "error", message: "Only Super Admin can edit roles." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/cms/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: selectedKey, permissionKeys: Array.from(draft) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Save failed");
      show({ type: "success", message: "Role saved" });
      await load();
    } catch (e: any) {
      show({ type: "error", message: e?.message ?? "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-neutral-400 font-bricolage py-6">Loading…</p>;
  if (error) return <p className="text-red-500 font-bricolage py-6">{error}</p>;

  return (
    <>
      <CmsToast toast={toast} />

      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-full sm:w-64">
              <Select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value as RoleKey)}>
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>{r.name}</option>
                ))}
              </Select>
            </div>
            {selected && (
              <div className="text-sm text-neutral-500 font-bricolage">
                Editing permissions for <span className="font-semibold text-neutral-900">{selected.name}</span>
              </div>
            )}
          </div>

          <Button onClick={save} disabled={!canWrite || saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {perms.map((p) => {
            const checked = draft.has(p.key);
            return (
              <label
                key={p.key}
                className={`flex items-start gap-3 p-3 rounded-xl border transition ${checked ? "border-[#9A6648]/30 bg-[#9A6648]/5" : "border-neutral-200/80 bg-white"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(p.key)}
                  disabled={!canWrite}
                  className="mt-1 h-4 w-4 accent-[#9A6648]"
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-neutral-900 font-bricolage">{p.label}</div>
                  <div className="text-xs text-neutral-400 font-bricolage break-words">{p.key}</div>
                  {p.description && <div className="mt-1 text-xs text-neutral-500 font-bricolage">{p.description}</div>}
                </div>
              </label>
            );
          })}
        </div>

        {!canWrite && (
          <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm text-neutral-500 font-bricolage">
            Read-only: only Super Admin can update role permissions.
          </div>
        )}
      </div>
    </>
  );
}
