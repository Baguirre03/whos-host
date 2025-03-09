// utils/googleMapsConfig.js
import { useJsApiLoader } from "@react-google-maps/api";

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

const libraries = ["places", "maps"];

export function useGoogleMapsApi() {
  return useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries,
  });
}
