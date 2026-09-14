'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

/**
 * Leaflet with OpenStreetMap tiles — free and key-free, per the brief.
 *
 * Note for the backend phase: OSM's public tile servers are fine for a prototype and
 * modest traffic but their usage policy discourages heavy production use. If traffic
 * grows, point `url` at a tile host with a plan (or self-host) rather than leaving it here.
 *
 * The marker is a div icon rather than Leaflet's bundled PNG, so the pin is brand green
 * and no extra image request is made.
 */
const pin = L.divIcon({
  className: 'cmt-pin',
  // Leaflet builds this as a plain string, outside our CSS pipeline, so the green is
  // hardcoded rather than a var() — keep it matched to --color-green in globals.css.
  html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#11341b;border:2px solid #daa706;box-shadow:0 3px 10px rgba(0,0,0,.35)"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -26],
});

export default function LeafletMap({
  center,
  label,
  zoom = 14,
}: {
  center: [number, number];
  label: string;
  zoom?: number;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
      // Keyboard users can still pan; the page keeps its scroll on touch devices.
      attributionControl
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      <Marker position={center} icon={pin} title={label}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}
