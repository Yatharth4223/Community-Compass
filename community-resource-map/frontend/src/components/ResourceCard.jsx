export default function ResourceCard({ r }) {
  const isFood = r.category === "Food";
  const isHealth = r.category === "Health";
  const isShelter = r.category === "Shelter";

  let bg = "#fff7ed"; // Food
  if (isHealth) bg = "#ecfeff";
  if (isShelter) bg = "#f5f3ff";

  return (
    <div
      style={{
        background: bg,
        borderRadius: 14,
        padding: 14,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          {/* TITLE — FIXED */}
          <div
            style={{
              fontWeight: 900,
              fontSize: 16,
              color: "#020617", // near-black for strong contrast
            }}
          >
            {r.name}
          </div>

          {/* CATEGORY */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#334155",
              opacity: 0.75,
              marginTop: 2,
              letterSpacing: "0.04em",
            }}
          >
            {r.category?.toUpperCase()}
          </div>
        </div>

        {typeof r.distanceKm === "number" && (
          <div
            style={{
              fontWeight: 800,
              color: "#020617",
              whiteSpace: "nowrap",
            }}
          >
            {r.distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          display: "grid",
          gap: 6,
          color: "#334155",
          fontSize: 14,
        }}
      >
        <div>📍 {r.address}</div>
        <div>📞 {r.phone}</div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: r.wheelchair ? "#0f766e" : "#64748b",
          }}
        >
          ♿ {r.wheelchair ? "Accessible" : "Not accessible"}
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: 800,
            textDecoration: "none",
            color: "#2563eb",
          }}
        >
          Directions ↗
        </a>
      </div>
    </div>
  );
}
