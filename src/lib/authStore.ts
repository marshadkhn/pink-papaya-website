import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/lib/adminModel";
import getLogger from "@/lib/logger";

const logger = getLogger("AUTH");

export type User = {
  id: string;
  username: string; // stores email
  passwordHash: string;
  role?: "admin";
};

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const count = await AdminUser.countDocuments();
  if (count > 0) {
    seeded = true;
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    logger.warn("No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set — no admin seeded");
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await AdminUser.create({ email, passwordHash: hash, role: "admin" });
  seeded = true;
  logger.info("Seeded initial admin", { email });
}

function toUser(doc: { _id: unknown; email: string; passwordHash: string; role?: string }): User {
  return {
    id: String(doc._id),
    username: doc.email,
    passwordHash: doc.passwordHash,
    role: "admin",
  };
}

export async function readUsers(): Promise<User[]> {
  await connectToDatabase();
  await ensureSeeded();
  const admins = await AdminUser.find().sort({ createdAt: 1 }).lean();
  return admins.map(toUser);
}

export async function getUserByUsername(email: string): Promise<User | undefined> {
  await connectToDatabase();
  await ensureSeeded();
  const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() }).lean();
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
  const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new Error("An admin with this email already exists");
  const hash = await bcrypt.hash(password, 12);
  await AdminUser.create({
    email: email.toLowerCase().trim(),
    passwordHash: hash,
    role: "admin",
    createdBy,
  });
  logger.info("Admin created", { email, createdBy });
}

export async function deleteAdminById(id: string): Promise<void> {
  await connectToDatabase();
  const count = await AdminUser.countDocuments();
  if (count <= 1) throw new Error("Cannot delete the last admin account");
  await AdminUser.findByIdAndDelete(id);
  logger.info("Admin deleted", { id });
}

export async function listAdmins(): Promise<
  { id: string; email: string; role: string; createdBy?: string; createdAt: Date }[]
> {
  await connectToDatabase();
  await ensureSeeded();
  const admins = await AdminUser.find().sort({ createdAt: 1 }).lean();
  return admins.map((a) => ({
    id: String(a._id),
    email: a.email,
    role: a.role ?? "admin",
    createdBy: a.createdBy,
    createdAt: a.createdAt,
  }));
}
