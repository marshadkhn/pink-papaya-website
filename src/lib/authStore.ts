import bcrypt from "bcryptjs";
import { prisma } from "@/lib/cms/store";
import { CmsRoleKey } from "@prisma/client";
import getLogger from "@/lib/logger";

const logger = getLogger("AUTH");

export type User = {
  id: string;
  username: string; // stores email
  passwordHash: string;
  role?: string;
};

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const count = await prisma.user.count();
  if (count > 0) {
    const hasSuper = (await prisma.user.count({ where: { roleKey: "super_admin" } })) > 0;
    if (!hasSuper) {
      await prisma.user.updateMany({
        where: { roleKey: "admin" },
        data: { roleKey: "super_admin" }
      });
    }
    seeded = true;
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    seeded = true;
    logger.warn("No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD (or legacy ADMIN_USERNAME/ADMIN_PASSWORD) set — no admin seeded");
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email: email.toLowerCase().trim(), passwordHash: hash, roleKey: "super_admin" } });
  seeded = true;
  logger.info("Seeded initial admin", { email });
}

function toUser(doc: { id: string; email: string; passwordHash: string; roleKey: string }): User {
  return {
    id: doc.id,
    username: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.roleKey,
  };
}

export async function readUsers(): Promise<User[]> {
  await ensureSeeded();
  const admins = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return admins.map(toUser);
}

export async function getUserByUsername(email: string): Promise<User | undefined> {
  await ensureSeeded();
  const admin = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) return undefined;
  return toUser(admin);
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  try {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (ok) logger.info("Login success", { email: user.username });
    else logger.warn("Login failed (wrong password)", { email: user.username });
    return ok;
  } catch (e: any) {
    logger.error("verifyPassword error", { error: e?.message });
    return false;
  }
}

export async function createAdmin(
  email: string,
  password: string,
  createdBy: string
): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) throw new Error("An admin with this email already exists");
  const hash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      roleKey: "admin",
      createdBy,
    }
  });
  logger.info("Admin created", { email, createdBy });
}

export async function createCmsUser(input: {
  email: string;
  password: string;
  role: string;
  createdBy: string;
}): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase().trim() } });
  if (existing) throw new Error("A user with this email already exists");
  const hash = await bcrypt.hash(input.password, 12);
  await prisma.user.create({
    data: {
      email: input.email.toLowerCase().trim(),
      passwordHash: hash,
      roleKey: input.role as CmsRoleKey,
      createdBy: input.createdBy,
    }
  });
  logger.info("CMS user created", { email: input.email, role: input.role, createdBy: input.createdBy });
}

export async function updateUserRoleById(id: string, role: string): Promise<void> {
  await prisma.user.update({ where: { id }, data: { roleKey: role as CmsRoleKey } });
  logger.info("User role updated", { id, role });
}

export async function deleteAdminById(id: string): Promise<void> {
  const count = await prisma.user.count();
  if (count <= 1) throw new Error("Cannot delete the last admin account");
  await prisma.user.delete({ where: { id } });
  logger.info("Admin deleted", { id });
}

export async function listAdmins(): Promise<
  { id: string; email: string; role: string; createdBy?: string | null; createdAt: Date }[]
> {
  await ensureSeeded();
  const admins = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return admins.map((a) => ({
    id: a.id,
    email: a.email,
    role: a.roleKey,
    createdBy: a.createdBy,
    createdAt: a.createdAt,
  }));
}

export async function listAllUsers(): Promise<
  { id: string; email: string; role: string; createdBy?: string | null; createdAt: Date }[]
> {
  await ensureSeeded();
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.roleKey,
    createdBy: u.createdBy,
    createdAt: u.createdAt,
  }));
}

export async function deleteUserById(id: string): Promise<void> {
  await ensureSeeded();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;

  if (user.roleKey === "super_admin") {
    const count = await prisma.user.count({ where: { roleKey: "super_admin" } });
    if (count <= 1) throw new Error("Cannot delete the last super admin account");
  }

  await prisma.user.delete({ where: { id } });
  logger.info("User deleted", { id });
}
