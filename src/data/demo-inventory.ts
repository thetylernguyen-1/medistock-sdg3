import { essentialMedicines } from "@/data/essential-medicines";
import { facilities } from "@/data/facilities";
import type { DemoInventoryRecord, StockStatus } from "@/types/medistock";

function hashValue(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function toStockStatus(quantity: number): StockStatus {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= 35) return "Low Stock";
  return "In Stock";
}

function buildUpdatedAt(seed: number) {
  const hour = 8 + (seed % 9);
  const minute = (seed * 7) % 60;
  return `24 May 2026, ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function buildInventoryForFacility(facilityId: string) {
  const facilitySeed = hashValue(facilityId);
  const recordCount = 4 + (facilitySeed % 3);
  const records: DemoInventoryRecord[] = [];

  for (let index = 0; index < recordCount; index += 1) {
    const medicine = essentialMedicines[(facilitySeed + index * 7) % essentialMedicines.length];
    const quantitySeed = hashValue(`${facilityId}-${medicine.id}`);
    const quantity = quantitySeed % 11 === 0 ? 0 : 8 + (quantitySeed % 145);

    records.push({
      facilityId,
      medicineId: medicine.id,
      medicineName: medicine.name,
      quantity,
      status: toStockStatus(quantity),
      updatedAt: buildUpdatedAt(quantitySeed),
      isDemo: true,
    });
  }

  return records;
}

export const demoInventory = facilities.flatMap((facility) => buildInventoryForFacility(facility.id));
