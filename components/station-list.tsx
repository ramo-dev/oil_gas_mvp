"use client";

import { useStations } from "@/hooks/useStations";
import { Station } from "@/types/station";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";

interface StationListProps {
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
}

export function StationList({
  selectedStation,
  onStationSelect,
}: StationListProps) {
  const { stations, loading, error } = useStations();

  if (loading) return <div>Loading stations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Nearby Stations</h2>
      {stations.map((station) => (
        <Card
          key={station.id}
          className={`cursor-pointer transition-colors ${
            selectedStation?.id === station.id
              ? "border-primary"
              : "hover:border-primary/50"
          }`}
          onClick={() => onStationSelect(station)}
        >
          <CardHeader>
            <CardTitle>{station.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["diesel", "petrol"].map((fuelType) => (
                <div key={fuelType} className="flex justify-between text-xs">
                  <span>
                    {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}:
                  </span>

                  <span className="font-semibold">
                    ksh{" "}
                    {(Array.isArray(station?.fuel_prices) &&
                      station?.fuel_prices?.find((p) => p.type === fuelType)
                        ?.price) ??
                      "N/A"}
                  </span>
                </div>
              ))}
              <div className="text-sm text-muted-foreground mt-2">
                Last updated:{" "}
                {formatDistanceToNow(new Date(station.last_updated).getDay(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
