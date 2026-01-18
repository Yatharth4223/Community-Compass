import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = ({ resources, userPos }) => {
  const center = userPos ? [userPos.lat, userPos.lng] : [43.45, -79.68];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location marker */}
      {userPos && (
        <Marker position={[userPos.lat, userPos.lng]}>
          <Popup>
            <strong>You are here</strong>
          </Popup>
        </Marker>
      )}

      {/* Resource markers */}
      {resources.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]}>
          <Popup>
            <strong>{r.name}</strong>
            <br />
            {r.category}
            <br />
            {r.address}
            <br />
            {r.hours ? (
              <>
                Hours: {r.hours}
                <br />
              </>
            ) : null}
            ♿ {r.wheelchair ? "Wheelchair accessible" : "Not wheelchair accessible"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
