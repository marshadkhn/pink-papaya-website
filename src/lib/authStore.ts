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

function envAdmin(): User | undefined {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return undefined;
  return {
    id: "admin",
    username,
    passwordHash: sha256Hex(password),
    role: "admin",
  };
}

export async function readUsers(): Promise<User[]> {
  const u = envAdmin();
  return u ? [u] : [];
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const u = envAdmin();
  if (u && u.username.toLowerCase() === username.toLowerCase()) return u;
  return undefined;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  const hash = sha256Hex(password);
  try {
    return crypto.timingSafeEqual(Buffer.from(user.passwordHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
