/**
 * Qibla Direction Calculator
 * Calculates the bearing to Kaaba from any location on Earth
 */

// Kaaba coordinates (Mecca, Saudi Arabia)
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate the bearing (Qibla direction) from user location to Kaaba
 * Returns bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
 */
export const calculateQiblaBearing = (userLocation: Location): number => {
  const lat1 = toRadians(userLocation.latitude);
  const lon1 = toRadians(userLocation.longitude);
  const lat2 = toRadians(KAABA_LAT);
  const lon2 = toRadians(KAABA_LON);

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = toDegrees(Math.atan2(y, x));
  // Normalize to 0-360
  return (bearing + 360) % 360;
};

/**
 * Get compass heading relative to Qibla
 * Returns the angle the compass arrow should rotate
 */
export const getQiblaArrowRotation = (
  qiblaBearing: number,
  compassHeading: number
): number => {
  // Calculate the angle difference
  let rotation = qiblaBearing - compassHeading;
  // Normalize to -180 to 180
  if (rotation > 180) rotation -= 360;
  if (rotation < -180) rotation += 360;
  return rotation;
};

/**
 * Format bearing as direction (N, NE, E, SE, S, SW, W, NW)
 */
export const getBearingDirection = (bearing: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Earth's radius in km
  const lat1 = toRadians(loc1.latitude);
  const lat2 = toRadians(loc2.latitude);
  const dLat = toRadians(loc2.latitude - loc1.latitude);
  const dLon = toRadians(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};
