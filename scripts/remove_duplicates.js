async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/stays');
    const stays = await res.json();
    
    const seen = {};
    for (const s of stays) {
      if (!seen[s.title]) seen[s.title] = [];
      seen[s.title].push(s);
    }
    
    let dupCount = 0;
    for (const [title, group] of Object.entries(seen)) {
      if (group.length > 1) {
        dupCount += group.length - 1;
        console.log(`Duplicate: "${title}" (${group.length} total)`);
        
        // Sort to keep the best one (the one with an ID that isn't a 24-char hex, or just the first)
        group.sort((a, b) => {
          const aIsObj = a.id && a.id.length === 24 && /^[0-9a-fA-F]+$/.test(a.id);
          const bIsObj = b.id && b.id.length === 24 && /^[0-9a-fA-F]+$/.test(b.id);
          if (!aIsObj && bIsObj) return -1;
          if (aIsObj && !bIsObj) return 1;
          return 0;
        });
        
        const best = group[0];
        console.log(`  Keeping id: ${best.id}`);
        
        for (let i = 1; i < group.length; i++) {
          const toDelete = group[i];
          console.log(`  Deleting id: ${toDelete.id}`);
          const delRes = await fetch(`http://localhost:3000/api/stays/${toDelete.id}`, { method: 'DELETE' });
          if (!delRes.ok) console.error(`  Failed to delete ${toDelete.id}`);
        }
      }
    }
    
    if (dupCount === 0) {
      console.log("No duplicates found by title.");
    } else {
      console.log(`Removed ${dupCount} duplicates successfully!`);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
