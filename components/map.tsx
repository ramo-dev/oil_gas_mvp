"use client";
import React, { useRef, useEffect, useState } from "react";
import Map, {
  Marker,
  Popup,
  ViewStateChangeEvent,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Fuel, MapPin, Navigation, Crosshair, Info } from "lucide-react";
import { Station } from "@/types/station";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGeolocation from "@/hooks/useGeolocation";
import { motion, AnimatePresence } from "framer-motion";
import { StationModal } from "./stationInfoModal";

interface MapComponentProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station | null) => void;
}

export function MapComponent({
  stations,
  selectedStation,
  //@ts-ignore
  onStationSelect,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const { country } = useGeolocation();
  const { longitude, latitude } = country;
  const [viewStation, setViewStation] = useState<Station | null>(null);
  const [viewState, setViewState] = useState({
    longitude: longitude || stations[0]?.location.lng || 36.81667,
    latitude: latitude || stations[0]?.location.lat || -1.28333,
    zoom: 14,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [route, setRoute] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smooth zoom to location
  const smoothZoomToLocation = (
    lat: number,
    lng: number,
    zoom: number = 14,
  ) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 1500,
        //@ts-ignore
        easing: (t) => t * (2 - t), // Smooth easing function
      });
    }
  };

  useEffect(() => {
    if (selectedStation) {
      smoothZoomToLocation(
        selectedStation.location.lat,
        selectedStation.location.lng,
        15,
      );
    }
  }, [selectedStation]);

  // Initial zoom to user's location on mount
  useEffect(() => {
    if (latitude && longitude) {
      smoothZoomToLocation(latitude, longitude, 12);
    }
  }, [latitude, longitude]);

  const fetchDirections = async (destination: { lat: number; lng: number }) => {
    if (!latitude || !longitude) return;

    // Zoom to destination with specific zoom level of 13
    smoothZoomToLocation(destination.lat, destination.lng, 13);

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destination.lng},${destination.lat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

    const res = await fetch(directionsUrl);
    const data = await res.json();
    setRoute(data.routes[0]?.geometry);

    // Optionally, still fit bounds to show entire route
    if (mapRef.current) {
      const bounds = data.routes[0]?.bounds;
      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          duration: 1500,
        });
      }
    }
  };

  const handleModalInfoSelect = (station: Station) => {
    setViewStation(station);
    setIsModalOpen(true);
  };

  const handleMarkerClick = (station: Station) => {
    onStationSelect(station);
    smoothZoomToLocation(station.location.lat, station.location.lng, 15);
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderMap = (fullscreen: boolean = false) => (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={handleMove}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: fullscreen ? "10px" : "inherit",
      }}
      maxZoom={20}
      minZoom={3}
    >
      {/* Stations Markers */}
      {stations.map((station) => (
        <React.Fragment key={station.id}>
          <Marker
            latitude={station.location.lat}
            longitude={station.location.lng}
            anchor="bottom"
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Fuel
                className={`cursor-pointer transition-all duration-300 ${
                  selectedStation?.id === station.id
                    ? "text-primary scale-125"
                    : "text-black"
                }`}
                onClick={() => handleMarkerClick(station)}
              />
            </motion.div>
          </Marker>

          {/* Animated Popup */}
          <AnimatePresence>
            {selectedStation?.id === station.id && (
              <Popup
                latitude={station.location.lat}
                longitude={station.location.lng}
                closeButton={true}
                closeOnClick={false}
                onClose={() => onStationSelect(null)}
                anchor="left"
                className="p-0 !rounded-lg text-black text-lg"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-max">
                    <CardHeader>
                      <CardTitle>{station.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {station.address}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="secondary"
                            className="flex items-center justify-center"
                            onClick={() =>
                              fetchDirections({
                                lat: station.location.lat,
                                lng: station.location.lng,
                              })
                            }
                          >
                            <Navigation className="mr-2 w-4 h-4" />
                            Get Directions
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="secondary"
                            className="flex items-center justify-center"
                            onClick={() => handleModalInfoSelect(station)}
                          >
                            <Info className="mr-2 w-4 h-4" />
                            Station Info
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Popup>
            )}
          </AnimatePresence>
        </React.Fragment>
      ))}

      {/* User Location Marker with Zoom to Location Button */}
      {latitude && longitude && (
        <div className="relative">
          <Marker latitude={latitude} longitude={longitude} anchor="bottom">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <MapPin className="text-red-500 animate-bounce" />
            </motion.div>
          </Marker>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-[-40px] left-[-40px] z-10 bg-white shadow-md"
            onClick={() => smoothZoomToLocation(latitude, longitude, 14)}
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Animated Route Layer */}
      {route && (
        <Source
          id="routeSource"
          type="geojson"
          //@ts-expect-error
          data={{ type: "Feature", geometry: route }}
        >
          <Layer
            id="routeLayer"
            type="line"
            paint={{
              "line-color": "#3b82f6",
              "line-width": 5,
              "line-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                6,
                0.6,
                10,
                1,
              ],
            }}
          />
        </Source>
      )}
    </Map>
  );

  return (
    <div className="w-full h-full overflow-hidden rounded-lg shadow-sm relative">
      {renderMap()}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 z-10 shadow-md"
        onClick={toggleFullscreen}
      >
        <Crosshair className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-14 right-2 z-10 shadow-md"
        //@ts-expect-error
        onClick={() => smoothZoomToLocation(latitude, longitude, 18)}
      >
        <MapPin className="h-4 w-4" />
      </Button>

      <Dialog open={isFullscreen} onOpenChange={toggleFullscreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0">
          <Button
            variant="outline"
            size="icon"
            className="absolute top-14 right-2 z-10 shadow-md"
            //@ts-expect-error
            onClick={() => smoothZoomToLocation(latitude, longitude, 18)}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <div className="w-full h-full">{renderMap(true)}</div>
        </DialogContent>
      </Dialog>
      {isModalOpen && (
        <StationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setViewStation(null);
          }}
          station={viewStation}
        />
      )}
    </div>
  );
}
