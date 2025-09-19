import crypto from "crypto";

export type User = {
  id: string;
  username: string;
  passwordHash: string; // sha256 hex
  role?: "admin" 
};

function sha256Hex(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function envAdmins(): User[] {
  const users: User[] = [];
  // Backward compatibility: single admin
  const singleU = process.env.ADMIN_USERNAME;
  const singleP = process.env.ADMIN_PASSWORD;
  if (singleU && singleP) {
    users.push({ id: singleU, username: singleU, passwordHash: sha256Hex(singleP), role: "admin" });
  }
  // Multiple admins: ADMIN1_..ADMIN4_
  for (let i = 1; i <= 4; i++) {
    const u = process.env[`ADMIN${i}_USERNAME` as any] as string | undefined;
    const p = process.env[`ADMIN${i}_PASSWORD` as any] as string | undefined;
    if (u && p) {
      users.push({ id: u, username: u, passwordHash: sha256Hex(p), role: "admin" });
    }
  }
  // De-duplicate by username
  const seen = new Set<string>();
  return users.filter((x) => {
    const k = x.username.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export async function readUsers(): Promise<User[]> {
  return envAdmins();
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = envAdmins();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  const hash = sha256Hex(password);
  try {
    return crypto.timingSafeEqual(Buffer.from(user.passwordHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
