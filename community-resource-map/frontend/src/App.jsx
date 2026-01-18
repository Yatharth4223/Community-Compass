import { useEffect, useMemo, useState } from "react";
import MapView from "./components/MapView";
import DashboardLayout from "./components/DashboardLayout";

// Haversine distance in KM
function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function App() {
  const [resources, setResources] = useState([]);

  // Filters
  const [category, setCategory] = useState("All");
  const [wheelchairOnly, setWheelchairOnly] = useState(false);

  // Search (two layers)
  // 1) Area search: "Toronto" -> geocode -> fetch resources around that location
  const [areaQuery, setAreaQuery] = useState("");
  const [areaCenter, setAreaCenter] = useState(null); // { lat, lng }
  const [areaLabel, setAreaLabel] = useState("");
  const [areaError, setAreaError] = useState("");

  // 2) Filter results by name/address (inside the fetched area)
  const [searchQuery, setSearchQuery] = useState("");

  // Location
  const [userPos, setUserPos] = useState(null); // { lat, lng }
  const [locError, setLocError] = useState("");

  // Emergency mode
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Offline mode
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Fetch resources around either:
  // - searched area (areaCenter) OR
  // - user location (userPos) OR
  // - default backend center
  useEffect(() => {
    const base = "http://localhost:5000/resources";
    const center = areaCenter || userPos;

    const url = center
      ? `${base}?lat=${center.lat}&lng=${center.lng}&radius=7000`
      : `${base}?radius=7000`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const safe = Array.isArray(data) ? data : [];
        setResources(safe);
        localStorage.setItem("cachedResources", JSON.stringify(safe));
      })
      .catch(() => {
        const cached = localStorage.getItem("cachedResources");
        if (cached) setResources(JSON.parse(cached));
      });
  }, [userPos, areaCenter]);

  // Listen to online/offline changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onUseMyLocation = () => {
    setLocError("");

    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // If user chooses "my location", we clear any searched area so it truly shows nearby
        setAreaCenter(null);
        setAreaLabel("");
        setAreaError("");
        setAreaQuery("");

        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        if (err.code === 1) setLocError("Location permission denied.");
        else if (err.code === 2) setLocError("Location unavailable.");
        else setLocError("Could not get location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSearchArea = async () => {
    const q = areaQuery.trim();
    if (!q) return;

    setAreaError("");
    try {
      const resp = await fetch(
        `http://localhost:5000/geocode?q=${encodeURIComponent(q)}`
      );
      const data = await resp.json();

      if (!data.found) {
        setAreaError("Location not found. Try: city, province, country.");
        return;
      }

      // When user searches an area, that becomes the active center
      setAreaCenter({ lat: data.lat, lng: data.lng });
      setAreaLabel(data.label || q);

      // Optional: keep userPos but area search will take priority (areaCenter || userPos)
      // Also clear location error
      setLocError("");
    } catch {
      setAreaError("Could not search location. Check backend and internet.");
    }
  };

  const onClearArea = () => {
    setAreaCenter(null);
    setAreaLabel("");
    setAreaError("");
    setAreaQuery("");
  };

  const filteredAndScored = useMemo(() => {
    let result = resources;

    if (category !== "All") result = result.filter((r) => r.category === category);
    if (wheelchairOnly) result = result.filter((r) => r.wheelchair);

    // Filter by name/address inside current area
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q)
      );
    }

    // Sort by distance (relative to active center if present, else userPos)
    const center = areaCenter || userPos;
    if (center) {
      result = result
        .map((r) => ({
          ...r,
          distanceKm: distanceKm(center.lat, center.lng, r.lat, r.lng),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return result;
  }, [resources, category, wheelchairOnly, searchQuery, userPos, areaCenter]);

  const getClosestEmergency = () => {
    const center = areaCenter || userPos;
    if (!center) return null;

    const emergencyResources = resources.filter(
      (r) => r.category === "Shelter" || r.category === "Health"
    );

    if (emergencyResources.length === 0) return null;

    return emergencyResources
      .map((r) => ({
        ...r,
        distanceKm: distanceKm(center.lat, center.lng, r.lat, r.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)[0];
  };

  return (
    <DashboardLayout
      // Area search (location text -> resources around there)
      areaQuery={areaQuery}
      setAreaQuery={setAreaQuery}
      onSearchArea={onSearchArea}
      areaLabel={areaLabel}
      areaError={areaError}
      onClearArea={onClearArea}

      // Result filter (name/address)
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}

      // Existing
      category={category}
      setCategory={setCategory}
      wheelchairOnly={wheelchairOnly}
      setWheelchairOnly={setWheelchairOnly}
      onUseMyLocation={onUseMyLocation}
      userPos={userPos}
      isOffline={isOffline}
      locError={locError}
      emergencyMode={emergencyMode}
      setEmergencyMode={setEmergencyMode}
      emergencyResource={(areaCenter || userPos) ? getClosestEmergency() : null}
      filteredResources={filteredAndScored}
      MapComponent={<MapView resources={filteredAndScored} userPos={areaCenter || userPos} />}
    />
  );
}

export default App;
