async function main() {
  const url = "https://www.airbnb.co.in/rooms/1584060007789227621";
  console.log("Fetching live Airbnb listing for Sempre:", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!res.ok) {
    console.error("HTTP error:", res.status);
    return;
  }

  const html = await res.text();
  console.log("Downloaded HTML length:", html.length);

  const regex = /<script\b[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gm;
  let match;
  let allGroups = [];

  while ((match = regex.exec(html)) !== null) {
    if (match[1].includes("seeAllAmenitiesGroups") || match[1].includes("previewAmenitiesGroups")) {
      try {
        const parsed = JSON.parse(match[1]);
        function search(o) {
          if (!o || typeof o !== "object") return;
          if (Array.isArray(o.seeAllAmenitiesGroups) && o.seeAllAmenitiesGroups.length > 0) {
            allGroups = o.seeAllAmenitiesGroups;
          }
          for (const k of Object.keys(o)) search(o[k]);
        }
        search(parsed);
      } catch (e) {
        // ignore
      }
    }
  }

  console.log(`\nFound ${allGroups.length} Amenity Groups from Airbnb:\n`);

  const validAmenities = [];
  const unavailableAmenities = [];

  for (const g of allGroups) {
    console.log(`=== CATEGORY: ${g.title || g.name} ===`);
    if (Array.isArray(g.amenities)) {
      for (const a of g.amenities) {
        const name = (typeof a.title === 'string' ? a.title : typeof a.name === 'string' ? a.name : '').trim();
        const sub = typeof a.subtitle === 'string' ? a.subtitle.trim() : '';
        const available = a.available !== false;
        
        if (available && name) {
          validAmenities.push(sub ? `${name} (${sub})` : name);
          console.log(`  ✓ ${name}${sub ? ` - ${sub}` : ""}`);
        } else if (name) {
          unavailableAmenities.push(name);
          console.log(`  ✗ ${name} [NOT AVAILABLE / STRIKETHROUGH]`);
        }
      }
    }
    console.log("");
  }

  console.log(`\nTOTAL AVAILABLE AMENITIES FOR SEMPRE: ${validAmenities.length}`);
  console.log(`TOTAL UNAVAILABLE (STRIKETHROUGH ON AIRBNB): ${unavailableAmenities.length}`);
  if (unavailableAmenities.length > 0) {
    console.log("Unavailable list:", unavailableAmenities);
  }
}

main().catch(console.error);
