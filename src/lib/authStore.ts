import crypto from "crypto";
import bcrypt from "bcryptjs";
import getLogger from "@/lib/logger";

export type User = {
  id: string;
  username: string;
  passwordHash: string; // bcrypt or legacy sha256 hex
  role?: "admin";
};

const logger = getLogger("AUTH");

function sha256Hex(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

// Cache admins globally in development to avoid expensive bcrypt hashing on every request/HMR
let cachedAdmins: User[] | null = null;

function envAdmins(): User[] {
  if (cachedAdmins) return cachedAdmins;

  const users: User[] = [];
  // Backward compatibility: single admin
  const singleU = process.env.ADMIN_USERNAME;
  const singleP = process.env.ADMIN_PASSWORD;
  if (singleU && singleP) {
    // Hash admin passwords once (sync is fine during initialization)
    const start = Date.now();
    const hashed = bcrypt.hashSync(singleP, 11); // Use slightly lower cost for initialization speed
    users.push({ id: singleU, username: singleU, passwordHash: hashed, role: "admin" });
    logger.info("Admin user cached from env", { username: singleU, duration: `${Date.now() - start}ms` });
  }

  // Multiple admins: ADMIN1_..ADMIN4_
  for (let i = 1; i <= 4; i++) {
    const u = process.env[`ADMIN${i}_USERNAME` as any] as string | undefined;
    const p = process.env[`ADMIN${i}_PASSWORD` as any] as string | undefined;
    if (u && p) {
      const hashed = bcrypt.hashSync(p, 11);
      users.push({ id: u, username: u, passwordHash: hashed, role: "admin" });
    }
  }

  // De-duplicate by username
  const seen = new Set<string>();
  cachedAdmins = users.filter((x) => {
    const k = x.username.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return cachedAdmins;
}

export async function readUsers(): Promise<User[]> {
  return envAdmins();
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = envAdmins();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  // Support bcrypt hashes (recommended) and legacy sha256 hex hashes
  try {
    if (user.passwordHash?.startsWith("$2a$") || user.passwordHash?.startsWith("$2b$") || user.passwordHash?.startsWith("$2y$")) {
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (ok) logger.info("Login success (bcrypt)", { username: user.username });
      else logger.warn("Login failed (bcrypt)", { username: user.username });
      return ok;
    }

    // fallback: legacy sha256 hex stored as hex string
    const hash = sha256Hex(password);
    try {
      const ok = crypto.timingSafeEqual(Buffer.from(user.passwordHash, "hex"), Buffer.from(hash, "hex"));
      if (ok) logger.info("Login success (sha256-fallback)", { username: user.username });
      else logger.warn("Login failed (sha256-fallback)", { username: user.username });
      return ok;
    } catch (e) {
      logger.error("Password compare error", { username: user.username });
      return false;
    }
  } catch (e: any) {
    logger.error("verifyPassword error", { username: user.username, error: e?.message });
    return false;
  }
}
