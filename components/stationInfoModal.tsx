import { Fuel, Clock, Wrench, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Station } from "../types/station";
import { Button } from "./ui/button";

type StationModalProps = {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
};

export function StationModal({ station, isOpen, onClose }: StationModalProps) {
  if (!station) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Station Details</DialogTitle>
        </DialogHeader>
        <Card className="w-full shadow-lg border-none overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              {station.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{station.address}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 mb-4 bg-secondary p-3 rounded-md">
              {station.fuel_prices.map((fuel) => (
                <div key={fuel.type} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
                    <Fuel className="w-4 h-4 mr-1" />
                    {fuel.type}
                  </p>
                  <p className="text-lg font-bold">£{fuel.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2 flex items-center">
                  <Wrench className="w-4 h-4 mr-2" />
                  Services
                </p>
                <div className="flex flex-wrap gap-1">
                  {station.services.map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="capitalize text-xs px-2 py-0.5"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Operating Hours
                </p>
                <Badge variant="outline" className="text-xs">
                  {station.operating_hours}
                </Badge>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 mt-5"
            >
              Add to Favorites
              <Star className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
