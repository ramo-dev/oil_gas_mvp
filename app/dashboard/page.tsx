"use client";

import { Card } from "@/components/ui/card";
import { MapComponent } from "@/components/map";
import { StationList } from "@/components/station-list";
import { useStations } from "@/hooks/useStations";
import { useState } from "react";
import type { Station } from "@/types/station";
import { Navbar } from "@/components/navbar";

export default function Page() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { stations, loading, error } = useStations();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 h-[70vh]">
            <MapComponent
              stations={stations}
              selectedStation={selectedStation}
              onStationSelect={setSelectedStation}
            />
          </Card>
          <Card className="p-4 overflow-auto h-[70vh]">
            {loading ? (
              <p>Loading....</p>
            ) : (
              <StationList
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
