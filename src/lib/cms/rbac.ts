import { getSession } from "@/lib/auth";
import { Role, Permission, RolePermission } from "@/lib/models/Cms";
import { connectToDatabase } from "@/lib/mongodb";
import { CMS_PERMISSIONS, type CmsPermissionKey, ALL_CMS_PERMISSION_KEYS } from "@/lib/cms/permissions";

type CmsRoleKey = "super_admin" | "admin" | "editor" | "content_manager" | string;

const DEFAULT_ROLE_DEFS: Array<{ key: CmsRoleKey; name: string; permissionKeys: CmsPermissionKey[] }> = [
  {
    key: "super_admin",
    name: "Super Admin",
    permissionKeys: ALL_CMS_PERMISSION_KEYS,
  },
  {
    key: "admin",
    name: "Admin",
    permissionKeys: [
      "cms.pages.read",
      "cms.pages.write_content",
      "cms.pages.write_seo",
      "cms.media.read",
      "cms.media.write",
      "cms.users.read",
      "cms.users.write",
      "cms.roles.read",
      "cms.permissions.read",
    ],
  },
  {
    key: "editor",
    name: "Editor",
    permissionKeys: ["cms.pages.read", "cms.pages.write_content", "cms.media.read"],
  },
  {
    key: "content_manager",
    name: "Content Manager",
    permissionKeys: [
      "cms.pages.read",
      "cms.pages.write_seo",
      "cms.media.read",
      "cms.media.write",
    ],
  },
];

let seeded = false;
let rolePermCache: Map<string, Set<CmsPermissionKey>> | null = null;

export async function ensureCmsRbacSeeded() {
  if (seeded) return;
  await connectToDatabase();

  for (const perm of CMS_PERMISSIONS) {
    await Permission.findOneAndUpdate(
      { key: perm.key },
      { label: perm.label, description: perm.description },
      { upsert: true }
    );
  }

  for (const role of DEFAULT_ROLE_DEFS) {
    await Role.findOneAndUpdate(
      { key: role.key },
      { name: role.name },
      { upsert: true }
    );
    
    for (const pKey of role.permissionKeys) {
       await RolePermission.findOneAndUpdate(
         { roleKey: role.key, permissionKey: pKey },
         {}, 
         { upsert: true, setDefaultsOnInsert: true }
       );
    }
  }

  seeded = true;
}

async function loadRolePermissionCache() {
  await ensureCmsRbacSeeded();
  const roles = await Role.find();
  const allRolePerms = await RolePermission.find();
  
  rolePermCache = new Map();
  for (const r of roles) {
     const pKeys = allRolePerms.filter(rp => rp.roleKey === r.key).map(rp => rp.permissionKey as CmsPermissionKey);
     rolePermCache.set(r.key, new Set(pKeys));
  }
}

export async function getRolePermissions(role: string | undefined): Promise<Set<CmsPermissionKey>> {
  if (!role) return new Set();
  const key = role as CmsRoleKey;
  if (key === "super_admin") return new Set(ALL_CMS_PERMISSION_KEYS);

  if (!rolePermCache) await loadRolePermissionCache();
  const perms = rolePermCache?.get(key);
  return perms ? new Set(perms) : new Set();
}

export async function getCmsActorOrThrow() {
  const session = await getSession();
  if (!session) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
  return session;
}

export async function requireCmsPermission(permission: CmsPermissionKey) {
  const session = await getCmsActorOrThrow();
  const perms = await getRolePermissions(session.role);
  if (!perms.has(permission)) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }
  return { session, perms };
}

export async function requireAnyCmsPermission(permissions: CmsPermissionKey[]) {
  const session = await getCmsActorOrThrow();
  const perms = await getRolePermissions(session.role);
  const ok = permissions.some((p) => perms.has(p));
  if (!ok) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }
  return { session, perms };
}

export async function invalidateCmsRoleCache() {
  rolePermCache = null;
}
