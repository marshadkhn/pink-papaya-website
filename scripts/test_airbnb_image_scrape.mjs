async function scrapeAirbnbPhotos(url) {
  if (!url) return [];
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!res.ok) return [];
    const html = await res.text();

    const photos = [];
    const regex = /<script\b[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gm;
    let match;

    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes("baseUrl") || match[1].includes("picture") || match[1].includes("photos")) {
        try {
          const parsed = JSON.parse(match[1]);
          function search(o) {
            if (!o || typeof o !== "object") return;
            if (typeof o.baseUrl === "string" && o.baseUrl.includes("muscache.com")) {
              const highRes = o.baseUrl.replace(/\?.*$/, "");
              if (!photos.includes(highRes)) photos.push(highRes);
            }
            if (typeof o.picture === "string" && o.picture.includes("muscache.com")) {
              const highRes = o.picture.replace(/\?.*$/, "");
              if (!photos.includes(highRes)) photos.push(highRes);
            }
            if (typeof o.large === "string" && o.large.includes("muscache.com")) {
              const highRes = o.large.replace(/\?.*$/, "");
              if (!photos.includes(highRes)) photos.push(highRes);
            }
            for (const k of Object.keys(o)) search(o[k]);
          }
          search(parsed);
        } catch (e) {}
      }
    }

    return photos;
  } catch (e) {
    return [];
  }
}

async function main() {
  const sempreUrl = "https://www.airbnb.co.in/rooms/1584060007789227621";
  console.log("Scraping real Airbnb photos for Sempre:", sempreUrl);

  const photos = await scrapeAirbnbPhotos(sempreUrl);
  console.log(`Found ${photos.length} real Airbnb photos for Sempre!`);
  if (photos.length > 0) {
    console.log("Sample 5 photos:");
    console.log(photos.slice(0, 5));
  }
}

main().catch(console.error);
