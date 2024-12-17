import { useState, useEffect } from "react";

type Country = {
  country_name: string;
  longitude: number | null;
  latitude: number | null;
  currency?: string;
};

const useGeolocation = () => {
  const [country, setCountry] = useState<Country>({
    country_name: "Kenya",
    longitude: null,
    latitude: null,
  });

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          throw new Error("Failed to fetch geolocation");
        }
        const data = await response.json();
        setCountry({
          country_name: data.country_name || "Kenya",
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          currency: data.currency || "",
        });
      } catch (error) {
        console.error("Geolocation error:", error);
        setCountry({
          country_name: "Kenya",
          latitude: -1.28333,
          longitude: 36.81667,
        });
      }
    };

    const handleGeolocationError = () => {
      console.warn(
        "Geolocation blocked or unavailable. Using default country.",
      );
      setCountry({
        country_name: Math.random() > 0.5 ? "Kenya" : "Nigeria",
        latitude: null,
        longitude: null,
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => fetchCountry(),
        handleGeolocationError,
      );
    } else {
      handleGeolocationError();
    }
  }, []);

  return { country };
};

export default useGeolocation;
