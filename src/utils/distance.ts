// For this MVP, facilities are ranked using Haversine distance between the user
// and facility coordinates. In a production version with road-network data, this
// module could be replaced by Dijkstra or A* to optimize actual travel time.

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function calculateHaversineDistanceKm(from: Coordinates, to: Coordinates) {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const fromLatitudeRad = (from.latitude * Math.PI) / 180;
  const toLatitudeRad = (to.latitude * Math.PI) / 180;

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitudeRad) *
      Math.cos(toLatitudeRad) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function formatDistanceKm(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km`;
}
