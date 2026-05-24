export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Medicine = {
  id: string;
  name: string;
  category: string;
  form: string;
};

export type InventoryItem = {
  medicineId: string;
  medicineName: string;
  quantity: number;
  status: StockStatus;
  updatedAt: string;
};

export type Clinic = {
  id: string;
  name: string;
  area: string;
  address: string;
  distanceKm: number;
  phone: string;
  services: string[];
  inventory: InventoryItem[];
};

export type StockRequest = {
  id: string;
  clinicName: string;
  medicineName: string;
  quantityRequested: number;
  status: "Pending" | "Approved" | "Reviewing";
};
