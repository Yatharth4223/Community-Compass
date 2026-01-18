import ResourceCard from "./ResourceCard";

export default function DashboardLayout({
  // Area search (location)
  areaQuery,
  setAreaQuery,
  onSearchArea,
  areaLabel,
  areaError,
  onClearArea,

  // Filter results
  searchQuery,
  setSearchQuery,

  // Existing
  category,
  setCategory,
  wheelchairOnly,
  setWheelchairOnly,
  onUseMyLocation,
  userPos,
  isOffline,
  locError,
  emergencyMode,
  setEmergencyMode,
  emergencyResource,
  filteredResources,
  MapComponent,
}) {
  const shellBg = "#070c16";
  const panelBg = "rgba(15, 23, 42, 0.82)";
  const border = "1px solid rgba(148, 163, 184, 0.18)";
  const shadow = "0 10px 30px rgba(0,0,0,0.35)";

  const panelStyle = {
    background: panelBg,
    border,
    borderRadius: 18,
    boxShadow: shadow,
    backdropFilter: "blur(10px)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth:"100vw",
        background: `radial-gradient(1200px 600px at 20% 0%, rgba(14,165,164,0.20), transparent 60%),
                     radial-gradient(900px 500px at 90% 10%, rgba(59,130,246,0.14), transparent 55%),
                     ${shellBg}`,
      }}
    >
      <div style={{ width: "100%", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#0ea5a4",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 18,
              }}
              aria-hidden="true"
            >
              📍
            </div>
            <div>
              <div style={{ color: "white", fontSize: 22, fontWeight: 900 }}>
                Community Resources
              </div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>Find help near you</div>
            </div>
          </div>

          {/* Offline banner */}
          {isOffline && (
            <div
              style={{
                backgroundColor: "#fff3cd",
                color: "#664d03",
                padding: "10px 14px",
                marginBottom: 12,
                border: "1px solid #ffecb5",
                borderRadius: 12,
              }}
              role="status"
            >
              ⚠️ Offline mode: showing last saved resources
            </div>
          )}

          {/* Main flex layout */}
          <div
            className="__hackville_flex"
            style={{
              display: "flex",
              gap: 22,
              alignItems: "stretch",
              height: "calc(100vh - 140px)",
              minHeight: 520,
            }}
          >
            {/* Left: Controls */}
            <div style={{ ...panelStyle, width: 360, padding: 18, overflow: "auto" }}>
              {/* AREA SEARCH */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: "white", fontWeight: 900, marginBottom: 8 }}>
                  Search area
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="e.g., Toronto, ON"
                    value={areaQuery}
                    onChange={(e) => setAreaQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSearchArea();
                    }}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      background: "rgba(7, 12, 22, 0.9)",
                      color: "white",
                      fontWeight: 700,
                      outline: "none",
                    }}
                  />

                  <button
                    onClick={onSearchArea}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: "#0ea5a4",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Search
                  </button>

                  <button
                    onClick={onClearArea}
                    title="Clear area search"
                    style={{
                      padding: "12px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "rgba(7, 12, 22, 0.9)",
                      color: "white",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {areaLabel && (
                  <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 13 }}>
                    Showing results near: {areaLabel}
                  </div>
                )}

                {areaError && (
                  <div style={{ marginTop: 8, color: "#fb7185", fontSize: 13 }}>
                    {areaError}
                  </div>
                )}
              </div>

              {/* FILTER RESULTS */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: "white", fontWeight: 900, marginBottom: 8 }}>
                  Filter results
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 40px 12px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      background: "rgba(7, 12, 22, 0.9)",
                      color: "white",
                      fontWeight: 700,
                      outline: "none",
                    }}
                  />
                  {searchQuery?.trim() && (
                    <button
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear filter"
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "transparent",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 16,
                        fontWeight: 900,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* CATEGORY */}
              <div style={{ color: "white", fontWeight: 900, marginBottom: 10 }}>
                Category
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                {["All", "Food", "Health", "Shelter"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      background: category === c ? "#0ea5a4" : "rgba(7, 12, 22, 0.9)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                    aria-pressed={category === c}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* WHEELCHAIR */}
              <label style={{ display: "flex", gap: 10, alignItems: "center", color: "white", marginBottom: 14 }}>
                <input
                  type="checkbox"
                  checked={wheelchairOnly}
                  onChange={(e) => setWheelchairOnly(e.target.checked)}
                />
                Wheelchair accessible only
              </label>

              {/* LOCATION */}
              <button
                onClick={onUseMyLocation}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "#0ea5a4",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Use my location
              </button>

              {userPos && (
                <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 13 }}>
                  Location set ✅ (sorting by nearest)
                </div>
              )}

              {locError && (
                <div style={{ marginTop: 10, color: "#fb7185", fontSize: 13 }}>
                  {locError}
                </div>
              )}

              {/* EMERGENCY */}
              <button
                onClick={() => setEmergencyMode(true)}
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid #7f1d1d",
                  background: "#b91c1c",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                🚨 Emergency — Help Now
              </button>

              <div style={{ marginTop: 18, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 }}>
                Tip: Search an area (city) to explore other neighborhoods, or use your location to see nearby help.
              </div>
            </div>

            {/* Center: Map */}
            <div style={{ ...panelStyle, flex: 1, minWidth: 520, padding: 12, overflow: "hidden" }}>
              {MapComponent}
            </div>

            {/* Right: List */}
            <div style={{ ...panelStyle, width: 420, padding: 14, overflow: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div style={{ color: "white", fontWeight: 900, fontSize: 16 }}>
                  Nearby Resources
                </div>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                  {filteredResources.length} found
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredResources.map((r) => (
                  <ResourceCard key={r.id} r={r} />
                ))}
              </div>
            </div>
          </div>

          {/* Emergency modal */}
          {emergencyMode && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "grid",
                placeItems: "center",
                padding: 16,
                zIndex: 9999,
              }}
              role="dialog"
              aria-modal="true"
            >
              <div
                style={{
                  width: "min(540px, 100%)",
                  background: "white",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ fontWeight: 900, fontSize: 18, color: "#0a0101" }}>
                    Emergency Assistance
                  </div>

                  <button
                    onClick={() => setEmergencyMode(false)}
                    aria-label="Close emergency panel"
                    style={{
                      border: "none",
                      background: "#f1f5f9",
                      color: "#0f172a",
                      cursor: "pointer",
                      fontSize: 18,
                      fontWeight: 900,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {!userPos && (
                  <p style={{ marginTop: 10, color: "#b91c1c" }}>
                    Tip: Use “Use my location” or search an area to find the nearest help.
                  </p>
                )}

                {userPos && !emergencyResource && (
                  <p style={{ marginTop: 10 }}>No emergency resources found.</p>
                )}

                {userPos && emergencyResource && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: "#0a0101" }}>
                      {emergencyResource.name}
                    </div>
                    <div style={{ color: "#475569", marginTop: 6 }}>
                      {emergencyResource.address}
                    </div>
                    <div style={{ marginTop: 8, color: "#0a0101" }}>📞 {emergencyResource.phone}</div>

                    {typeof emergencyResource.distanceKm === "number" && (
                      <div style={{ marginTop: 6, color: "#0a0101" }}>
                        📍 {emergencyResource.distanceKm.toFixed(2)} km away
                      </div>
                    )}

                    <a
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        fontWeight: 900,
                        color: "#0ea5a4",
                      }}
                      href={`https://www.google.com/maps/dir/?api=1&destination=${emergencyResource.lat},${emergencyResource.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions →
                    </a>

                    <div style={{ marginTop: 14 }}>
                      <button
                        onClick={() => setEmergencyMode(false)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          background: "white",
                          cursor: "pointer",
                          fontWeight: 900,
                          color: "#982c07",
                        }}
                      >
                        Exit Emergency Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Responsive stack for smaller widths */}
          <style>{`
            @media (max-width: 1100px) {
              .__hackville_flex {
                flex-direction: column !important;
                height: auto !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
