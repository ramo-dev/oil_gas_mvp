export interface Station {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  fuel_prices: Array<{
    type: string;
    price: number;
  }>;
  services: string[];
  operating_hours: string;
  rating: number;
  additive_available: boolean;
  rewards_supported: boolean;
  is_partner_station: boolean;
  fuel_stock_levels: {
    diesel: string;
    petrol: string;
  };
  last_updated: string;
}
