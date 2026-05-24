import type { Clinic, Medicine, StockRequest } from "@/types/medistock";

export const medicines: Medicine[] = [
  { id: "paracetamol", name: "Paracetamol", category: "Pain Relief", form: "Tablets" },
  { id: "amoxicillin", name: "Amoxicillin", category: "Antibiotic", form: "Capsules" },
  { id: "ors", name: "Oral Rehydration Salts", category: "Hydration", form: "Sachets" },
  { id: "mmr", name: "MMR Vaccine", category: "Vaccine", form: "Injection" },
];

export const clinics: Clinic[] = [
  {
    id: "green-valley-clinic",
    name: "Green Valley Clinic",
    area: "North District",
    address: "14 Riverside Avenue",
    distanceKm: 1.8,
    phone: "+49 30 555 0121",
    services: ["Primary care", "Vaccination", "Maternal health"],
    inventory: [
      {
        medicineId: "paracetamol",
        medicineName: "Paracetamol",
        quantity: 128,
        status: "In Stock",
        updatedAt: "Today, 08:15",
      },
      {
        medicineId: "ors",
        medicineName: "Oral Rehydration Salts",
        quantity: 21,
        status: "Low Stock",
        updatedAt: "Today, 08:15",
      },
    ],
  },
  {
    id: "harbor-community-pharmacy",
    name: "Harbor Community Pharmacy",
    area: "Central Market",
    address: "82 Harbor Lane",
    distanceKm: 3.2,
    phone: "+49 30 555 0147",
    services: ["Dispensing", "Cold-chain storage", "Health information"],
    inventory: [
      {
        medicineId: "amoxicillin",
        medicineName: "Amoxicillin",
        quantity: 42,
        status: "In Stock",
        updatedAt: "Today, 07:42",
      },
      {
        medicineId: "mmr",
        medicineName: "MMR Vaccine",
        quantity: 0,
        status: "Out of Stock",
        updatedAt: "Today, 07:42",
      },
    ],
  },
  {
    id: "sunrise-health-post",
    name: "Sunrise Health Post",
    area: "East Ward",
    address: "5 Unity Street",
    distanceKm: 4.6,
    phone: "+49 30 555 0180",
    services: ["Primary care", "Child health", "Outreach support"],
    inventory: [
      {
        medicineId: "paracetamol",
        medicineName: "Paracetamol",
        quantity: 12,
        status: "Low Stock",
        updatedAt: "Today, 09:02",
      },
      {
        medicineId: "mmr",
        medicineName: "MMR Vaccine",
        quantity: 8,
        status: "Low Stock",
        updatedAt: "Today, 09:02",
      },
    ],
  },
];

export const stockRequests: StockRequest[] = [
  {
    id: "REQ-1021",
    clinicName: "Sunrise Health Post",
    medicineName: "MMR Vaccine",
    quantityRequested: 30,
    status: "Reviewing",
  },
  {
    id: "REQ-1022",
    clinicName: "Green Valley Clinic",
    medicineName: "Oral Rehydration Salts",
    quantityRequested: 50,
    status: "Pending",
  },
];

export const dashboardMetrics = [
  { label: "Clinics Reporting", value: "18", helper: "Updated within 24 hours" },
  { label: "Low-stock Items", value: "7", helper: "Need monitoring this week" },
  { label: "Out-of-stock Alerts", value: "2", helper: "Escalate to supply teams" },
];

export const stockTrend = [
  { name: "Mon", inStock: 18, lowStock: 5, outOfStock: 1 },
  { name: "Tue", inStock: 17, lowStock: 6, outOfStock: 1 },
  { name: "Wed", inStock: 16, lowStock: 7, outOfStock: 2 },
  { name: "Thu", inStock: 18, lowStock: 6, outOfStock: 2 },
  { name: "Fri", inStock: 19, lowStock: 5, outOfStock: 1 },
];
