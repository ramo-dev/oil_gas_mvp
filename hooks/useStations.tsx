import { useState, useEffect } from "react";
import { Station } from "@/types/station";

export const useStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const url = process.env.NEXT_BASE_URL;
        if (!url) return;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();

        // Transform API data to match Station type
        const transformedStations = data.map((station: any) => ({
          id: station.id,
          name: station.name,
          location: {
            lat: station.latitude,
            lng: station.longitude,
          },
          address: station.address,
          fuel_prices: station?.fuel_prices as Array<{
            type: string;
            price: number;
          }>,
          services: station.services,
          operating_hours: station.operating_hours,
          rating: parseFloat(station.rating), // Convert rating to number
          additive_available: station.additive_available,
          rewards_supported: station.rewards_supported,
          is_partner_station: station.is_partner_station,
          fuel_stock_levels: station.fuel_stock_levels,
          last_updated: station.last_updated || new Date().toISOString(),
        }));

        setStations(transformedStations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return { stations, loading, error };
};
