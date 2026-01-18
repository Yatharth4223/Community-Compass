const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ----------- Overpass (real POI data) -----------
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const CACHE_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map(); // key -> { ts, data }

function buildOverpassQuery(lat, lng, radius) {
  return `
[out:json][timeout:25];
(
  // Hospitals
  node(around:${radius},${lat},${lng})["amenity"="hospital"];
  way(around:${radius},${lat},${lng})["amenity"="hospital"];
  relation(around:${radius},${lat},${lng})["amenity"="hospital"];

  // Food banks
  node(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="food_bank"];
  way(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="food_bank"];
  relation(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="food_bank"];

  // Soup kitchens
  node(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="soup_kitchen"];
  way(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="soup_kitchen"];
  relation(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="soup_kitchen"];

  // Shelters
  node(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="shelter"];
  way(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="shelter"];
  relation(around:${radius},${lat},${lng})["amenity"="social_facility"]["social_facility"="shelter"];
);
out center tags;
`;
}

function mapToCategory(tags) {
  if (tags.amenity === "hospital") return "Health";
  if (tags.amenity === "social_facility" && tags.social_facility === "shelter") return "Shelter";
  if (
    tags.amenity === "social_facility" &&
    (tags.social_facility === "food_bank" || tags.social_facility === "soup_kitchen")
  ) {
    return "Food";
  }
  return "Health";
}

function toResource(el) {
  const tags = el.tags || {};
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const addressParts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter(Boolean);

  return {
    id: `${el.type}-${el.id}`,
    name: tags.name || "Unnamed",
    category: mapToCategory(tags),
    address: addressParts.join(" ") || tags["addr:full"] || "Address unavailable",
    phone: tags.phone || tags["contact:phone"] || "N/A",
    hours: tags.opening_hours || "",
    wheelchair: tags.wheelchair === "yes",
    lat,
    lng,
  };
}

async function postOverpass(query) {
  const resp = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ data: query }),
  });
  if (!resp.ok) throw new Error(`Overpass error ${resp.status}`);
  return resp.json();
}

// ----------- Geocoding (text -> lat/lng) -----------
app.get("/geocode", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  if (!q) return res.status(400).json({ error: "Missing q" });

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        format: "json",
        q,
        limit: "1",
        addressdetails: "1",
      });

    const resp = await fetch(url, {
      headers: {
        "User-Agent": "community-resource-map/1.0 (hackathon demo)",
      },
    });

    if (!resp.ok) return res.status(500).json({ error: "Geocode failed" });

    const data = await resp.json();
    if (!data.length) return res.json({ found: false });

    const hit = data[0];
    res.json({
      found: true,
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      label: hit.display_name,
    });
  } catch {
    res.status(500).json({ error: "Geocode error" });
  }
});

// ----------- Resources (real data) -----------
app.get("/", (req, res) => {
  res.send("Backend is running ✅ Try /resources or /geocode?q=toronto");
});

app.get("/resources", async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Number(req.query.radius || 7000);

  // Default center (Oakville) if nothing provided
  const safeLat = Number.isFinite(lat) ? lat : 43.4675;
  const safeLng = Number.isFinite(lng) ? lng : -79.6877;

  const cacheKey = `${safeLat.toFixed(3)}:${safeLng.toFixed(3)}:${radius}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return res.json(cached.data);
  }

  try {
    const query = buildOverpassQuery(safeLat, safeLng, radius);
    const data = await postOverpass(query);

    const resources = (data.elements || []).map(toResource).filter(Boolean);

    cache.set(cacheKey, { ts: Date.now(), data: resources });
    res.json(resources);
  } catch (e) {
    // fallback: return any cached data or empty
    const anyCached = cache.values().next().value?.data || [];
    res.status(200).json(anyCached);
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
