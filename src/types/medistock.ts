import type { FacilityProfile } from "@/types/facility";

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type KenyaFacility = {
  id: string;
  name: string;
  facilityType: string;
  county: string;
  subCounty?: string;
  addressOrArea?: string;
  latitude: number;
  longitude: number;
  ownership?: string;
  services: string[];
  source: "HOTOSM Kenya Health Facilities" | "MediStock Kenya Demo Facilities";
};

export type Medicine = {
  id: string;
  name: string;
  category: string;
  form: string;
};

export type InventoryItem = {
  facilityId?: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  status: StockStatus;
  updatedAt: string;
  isDemo?: boolean;
};

export type DemoInventoryRecord = InventoryItem & {
  facilityId: string;
  isDemo: true;
};

export type InventoryRow = {
  clinicId: string;
  clinicName: string;
  county: string;
  area: string;
  address: string;
  facilityType: string;
  ownership?: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  status: StockStatus;
  updatedAt: string;
  isDemo: true;
};

export type Clinic = FacilityProfile & {
  area: string;
  address: string;
  inventory: InventoryItem[];
  services: string[];
};

export type StockRequest = {
  id: string;
  clinicName: string;
  medicineName: string;
  quantityRequested: number;
  status: "Pending" | "Approved" | "Reviewing";
};
