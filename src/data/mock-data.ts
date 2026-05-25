import { demoInventory } from "@/data/demo-inventory";
import { essentialMedicines } from "@/data/essential-medicines";
import { facilities, serviceTagLabels } from "@/data/facilities";
import type {
  Clinic,
  DemoInventoryRecord,
  InventoryRow,
  Medicine,
  StockRequest,
  StockStatus,
} from "@/types/medistock";

export const medicines: Medicine[] = essentialMedicines;

const inventorySortOrder: Record<StockStatus, number> = {
  "Out of Stock": 0,
  "Low Stock": 1,
  "In Stock": 2,
};

export function buildDemoData(records: DemoInventoryRecord[]) {
  const inventoryByFacilityId = new Map<string, DemoInventoryRecord[]>();
  for (const record of records) {
    const current = inventoryByFacilityId.get(record.facilityId) ?? [];
    current.push(record);
    inventoryByFacilityId.set(record.facilityId, current);
  }

  const validFacilityIds = new Set(facilities.map((facility) => facility.id));
  const filteredRecords = records.filter((record) => validFacilityIds.has(record.facilityId));

  const clinics: Clinic[] = facilities.map((facility) => ({
    ...facility,
    area: [facility.county, facility.subCounty].filter(Boolean).join(" · "),
    address: facility.areaOrAddress ?? `${facility.county}, Kenya`,
    services: facility.serviceTags.map((tag) => serviceTagLabels[tag]),
    inventory: (inventoryByFacilityId.get(facility.id) ?? [])
      .slice()
      .sort((left, right) => {
        const statusDelta = inventorySortOrder[left.status] - inventorySortOrder[right.status];
        if (statusDelta !== 0) return statusDelta;
        return left.medicineName.localeCompare(right.medicineName);
      }),
  }));

  const inventoryRows: InventoryRow[] = clinics.flatMap((clinic) =>
    clinic.inventory.map((item) => ({
      clinicId: clinic.id,
      clinicName: clinic.name,
      county: clinic.county,
      area: clinic.area,
      address: clinic.address,
      facilityType: clinic.facilityType,
      ownership: clinic.ownership,
      medicineId: item.medicineId,
      medicineName: item.medicineName,
      quantity: item.quantity,
      status: item.status,
      updatedAt: item.updatedAt,
      isDemo: true,
    })),
  );

  const countySummaries = Object.entries(
    clinics.reduce<Record<string, { facilities: number; lowStock: number; outOfStock: number }>>((summary, clinic) => {
      const current = summary[clinic.county] ?? { facilities: 0, lowStock: 0, outOfStock: 0 };
      current.facilities += 1;
      current.lowStock += clinic.inventory.filter((item) => item.status === "Low Stock").length;
      current.outOfStock += clinic.inventory.filter((item) => item.status === "Out of Stock").length;
      summary[clinic.county] = current;
      return summary;
    }, {}),
  )
    .map(([county, values]) => ({ county, ...values }))
    .sort((left, right) => left.county.localeCompare(right.county));

  const stockCounts = filteredRecords.reduce(
    (counts, item) => {
      counts[item.status] += 1;
      return counts;
    },
    {
      "In Stock": 0,
      "Low Stock": 0,
      "Out of Stock": 0,
    } satisfies Record<StockStatus, number>,
  );

  const dashboardMetrics = [
    {
      label: "Facilities in demo",
      value: String(clinics.length),
      helper: "Urban and rural Kenya facility context for SDG 3 testing",
    },
    {
      label: "Tracked essentials",
      value: String(medicines.length),
      helper: "WHO-inspired medicine and vaccine concepts with simulated stock",
    },
    {
      label: "Low or out of stock",
      value: String(stockCounts["Low Stock"] + stockCounts["Out of Stock"]),
      helper: "Demo inventory signals that help teams discuss resupply priorities",
    },
  ];

  const outOfStockRows = inventoryRows.filter((row) => row.status === "Out of Stock");
  const lowStockRows = inventoryRows.filter((row) => row.status === "Low Stock");

  const lowStockFacilities = clinics
    .map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      county: clinic.county,
      lowStockCount: clinic.inventory.filter((item) => item.status === "Low Stock").length,
      outOfStockCount: clinic.inventory.filter((item) => item.status === "Out of Stock").length,
    }))
    .filter((clinic) => clinic.lowStockCount > 0 || clinic.outOfStockCount > 0)
    .sort((left, right) => {
      const severityDelta = right.outOfStockCount - left.outOfStockCount || right.lowStockCount - left.lowStockCount;
      if (severityDelta !== 0) return severityDelta;
      return left.name.localeCompare(right.name);
    })
    .slice(0, 6);

  const stockRequests: StockRequest[] = lowStockFacilities.slice(0, 4).map((clinic, index) => {
    const matchingItem =
      clinics
        .find((entry) => entry.id === clinic.id)
        ?.inventory.find((item) => item.status !== "In Stock");

    return {
      id: `REQ-KE-${String(index + 1).padStart(3, "0")}`,
      clinicName: clinic.name,
      medicineName: matchingItem?.medicineName ?? "Priority essential medicine",
      quantityRequested: 40 + index * 15,
      status: index % 2 === 0 ? "Reviewing" : "Pending",
    };
  });

  const baseInStock = stockCounts["In Stock"];
  const baseLowStock = stockCounts["Low Stock"];
  const baseOutOfStock = stockCounts["Out of Stock"];

  const stockTrend = [
    { name: "Mon", inStock: Math.max(baseInStock - 6, 0), lowStock: baseLowStock + 2, outOfStock: Math.max(baseOutOfStock - 1, 0) },
    { name: "Tue", inStock: Math.max(baseInStock - 4, 0), lowStock: baseLowStock + 1, outOfStock: baseOutOfStock },
    { name: "Wed", inStock: Math.max(baseInStock - 3, 0), lowStock: baseLowStock + 3, outOfStock: baseOutOfStock + 1 },
    { name: "Thu", inStock: Math.max(baseInStock - 2, 0), lowStock: Math.max(baseLowStock - 1, 0), outOfStock: baseOutOfStock + 1 },
    { name: "Fri", inStock: baseInStock, lowStock: baseLowStock, outOfStock: baseOutOfStock },
  ];

  const featuredCounties = countySummaries.map((item) => item.county);

  const inventoryStatusSummary = {
    inStock: stockCounts["In Stock"],
    lowStock: stockCounts["Low Stock"],
    outOfStock: stockCounts["Out of Stock"],
    totalRecords: filteredRecords.length,
    totalFacilities: clinics.length,
  };

  const priorityMedicines = Array.from(
    inventoryRows.reduce<Map<string, { name: string; lowStock: number; outOfStock: number }>>((summary, row) => {
      const current = summary.get(row.medicineName) ?? { name: row.medicineName, lowStock: 0, outOfStock: 0 };
      if (row.status === "Low Stock") current.lowStock += 1;
      if (row.status === "Out of Stock") current.outOfStock += 1;
      summary.set(row.medicineName, current);
      return summary;
    }, new Map()),
  )
    .map(([, value]) => value)
    .sort((left, right) => right.outOfStock - left.outOfStock || right.lowStock - left.lowStock)
    .slice(0, 5);

  const summaryAlert = outOfStockRows.length
    ? `${outOfStockRows.length} demo inventory entries are currently out of stock across the sample facilities.`
    : `${lowStockRows.length} demo inventory entries are currently flagged as low stock across the sample facilities.`;

  return {
    medicines,
    clinics,
    inventoryRows,
    countySummaries,
    dashboardMetrics,
    lowStockFacilities,
    stockRequests,
    stockTrend,
    featuredCounties,
    inventoryStatusSummary,
    priorityMedicines,
    summaryAlert,
  };
}

const baseDemoData = buildDemoData(demoInventory);

export const clinics = baseDemoData.clinics;
export const inventoryRows = baseDemoData.inventoryRows;
export const countySummaries = baseDemoData.countySummaries;
export const dashboardMetrics = baseDemoData.dashboardMetrics;
export const lowStockFacilities = baseDemoData.lowStockFacilities;
export const stockRequests = baseDemoData.stockRequests;
export const stockTrend = baseDemoData.stockTrend;
export const featuredCounties = baseDemoData.featuredCounties;
export const inventoryStatusSummary = baseDemoData.inventoryStatusSummary;
export const priorityMedicines = baseDemoData.priorityMedicines;
export const summaryAlert = baseDemoData.summaryAlert;

export const dataSourceLabel = "MediStock Kenya Demo Facilities";
export const dataSourceNotes = [
  "Facility names and locations are curated demo data inspired by healthcare access challenges in Kenya.",
  "Medicine names are based on essential medicine concepts.",
  "Inventory quantities are simulated demo values.",
  "Stock is not real-time.",
  "MediStock does not provide medical advice.",
];
