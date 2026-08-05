import { execSync } from "child_process";

const commits = ["a02641d", "7900be4", "d6561ed", "6556a30", "1cbea11"];

for (const hash of commits) {
  try {
    const code = execSync(`git show ${hash}:src/data/stays.ts`, { encoding: "utf-8" });
    console.log(`=== COMMIT: ${hash} ===`);
    const idMatches = code.match(/id:\s*"([^"]+)"/g) || [];
    console.log("Stays count in stays.ts:", idMatches.length);
    const imgMatches = code.match(/imageUrl:\s*"([^"]+)"/g) || [];
    console.log("Sample imageUrls:", imgMatches.slice(0, 8));
  } catch (e) {
    console.log(`${hash} error:`, e.message.slice(0, 60));
  }
}
