export const displayMap = (locations) => {
  const [lat, lng] = locations[0].coordinates;

  const map = L.map("map").setView([lng, lat], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  locations.forEach((loc) => {
    let [lati, lngi] = loc.coordinates;
    L.marker([lngi, lati]).addTo(map);
  });
};
