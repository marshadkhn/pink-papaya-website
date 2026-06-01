import bcrypt from "bcryptjs";
import { User as UserModel } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
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
  await connectToDatabase();
  const count = await UserModel.countDocuments();
  if (count > 0) {
    const hasSuper = (await UserModel.countDocuments({ roleKey: "super_admin" })) > 0;
    if (!hasSuper) {
      await UserModel.updateMany(
        { roleKey: "admin" },
        { roleKey: "super_admin" }
      );
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
  await UserModel.create({ email: email.toLowerCase().trim(), passwordHash: hash, roleKey: "super_admin" });
  seeded = true;
  logger.info("Seeded initial admin", { email });
}

function toUser(doc: any): User {
  return {
    id: doc.id.toString(),
    username: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.roleKey,
  };
}

export async function readUsers(): Promise<User[]> {
  await ensureSeeded();
  const admins = await UserModel.find().sort({ createdAt: 1 });
  return admins.map(toUser);
}

export async function getUserByUsername(email: string): Promise<User | undefined> {
  await ensureSeeded();
  const admin = await UserModel.findOne({ email: email.toLowerCase().trim() });
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
  await connectToDatabase();
  const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new Error("An admin with this email already exists");
  const hash = await bcrypt.hash(password, 12);
  await UserModel.create({
    email: email.toLowerCase().trim(),
    passwordHash: hash,
    roleKey: "admin",
    createdBy,
  });
  logger.info("Admin created", { email, createdBy });
}

export async function createCmsUser(input: {
  email: string;
  password: string;
  role: string;
  createdBy: string;
}): Promise<void> {
  await connectToDatabase();
  const existing = await UserModel.findOne({ email: input.email.toLowerCase().trim() });
  if (existing) throw new Error("A user with this email already exists");
  const hash = await bcrypt.hash(input.password, 12);
  await UserModel.create({
    email: input.email.toLowerCase().trim(),
    passwordHash: hash,
    roleKey: input.role,
    createdBy: input.createdBy,
  });
  logger.info("CMS user created", { email: input.email, role: input.role, createdBy: input.createdBy });
}

export async function updateUserRoleById(id: string, role: string): Promise<void> {
  await connectToDatabase();
  await UserModel.findByIdAndUpdate(id, { roleKey: role });
  logger.info("User role updated", { id, role });
}

export async function deleteAdminById(id: string): Promise<void> {
  await connectToDatabase();
  const count = await UserModel.countDocuments();
  if (count <= 1) throw new Error("Cannot delete the last admin account");
  await UserModel.findByIdAndDelete(id);
  logger.info("Admin deleted", { id });
}

export async function listAdmins(): Promise<
  { id: string; email: string; role: string; createdBy?: string | null; createdAt: Date }[]
> {
  await ensureSeeded();
  const admins = await UserModel.find().sort({ createdAt: 1 });
  return admins.map((a) => ({
    id: a.id.toString(),
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
  const users = await UserModel.find().sort({ createdAt: 1 });
  return users.map((u) => ({
    id: u.id.toString(),
    email: u.email,
    role: u.roleKey,
    createdBy: u.createdBy,
    createdAt: u.createdAt,
  }));
}

export async function deleteUserById(id: string): Promise<void> {
  await ensureSeeded();

  const user = await UserModel.findById(id);
  if (!user) return;

  if (user.roleKey === "super_admin") {
    const count = await UserModel.countDocuments({ roleKey: "super_admin" });
    if (count <= 1) throw new Error("Cannot delete the last super admin account");
  }

  await UserModel.findByIdAndDelete(id);
  logger.info("User deleted", { id });
}
