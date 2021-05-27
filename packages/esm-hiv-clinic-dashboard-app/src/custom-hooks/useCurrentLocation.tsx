const locationUuidKey = 'location_uuid';

export function useCurrentLocation(): string | null {
  return window.localStorage.getItem(locationUuidKey);
}
