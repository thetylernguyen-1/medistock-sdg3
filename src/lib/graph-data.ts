import { clinics, inventoryRows, medicines, stockRequests } from "@/data/mock-data";
import type { Clinic, InventoryRow, Medicine, StockRequest, StockStatus } from "@/types/medistock";

export type SupplyNetworkFilters = {
  county: string;
  medicine: string;
  stockStatus: string;
  risk: string;
};

export type SupplyGraphNodeKind =
  | "county"
  | "facility"
  | "medicine"
  | "status"
  | "request"
  | "risk";

export type SupplyGraphNode = {
  id: string;
  kind: SupplyGraphNodeKind;
  label: string;
  title: string;
  subtitle?: string;
  tone: "teal" | "sky" | "amber" | "rose" | "slate";
  tags: string[];
  detailLines: string[];
  metrics: { label: string; value: string }[];
};

export type SupplyGraphEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  tone: "teal" | "sky" | "amber" | "rose" | "slate";
};

export type SupplyGraphOption = {
  label: string;
  value: string;
};

export type SupplyNetworkData = {
  nodes: SupplyGraphNode[];
  edges: SupplyGraphEdge[];
  summary: {
    facilityCount: number;
    medicineCount: number;
    requestCount: number;
    riskCount: number;
    inventoryRecordCount: number;
  };
  options: {
    county: SupplyGraphOption[];
    medicine: SupplyGraphOption[];
    stockStatus: SupplyGraphOption[];
    risk: SupplyGraphOption[];
  };
};

type SupplyNetworkSource = {
  clinics: Clinic[];
  inventoryRows: InventoryRow[];
  medicines: Medicine[];
  stockRequests: StockRequest[];
};

const MAX_VISIBLE_FACILITIES = 12;

const riskOptions: SupplyGraphOption[] = [
  { label: "All risk levels", value: "all" },
  { label: "Heightened shortage risk", value: "severe" },
  { label: "Watchlist", value: "watch" },
  { label: "Stable coverage", value: "stable" },
];

const stockOptions: SupplyGraphOption[] = [
  { label: "All stock states", value: "all" },
  { label: "In Stock", value: "In Stock" },
  { label: "Low Stock", value: "Low Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
];

function buildFacilityRiskById(sourceClinics: Clinic[]) {
  return new Map(
    sourceClinics.map((clinic) => {
    const lowStock = clinic.inventory.filter((item) => item.status === "Low Stock").length;
    const outOfStock = clinic.inventory.filter((item) => item.status === "Out of Stock").length;
    const risk = outOfStock > 0 ? "severe" : lowStock > 0 ? "watch" : "stable";

    return [
      clinic.id,
      {
        lowStock,
        outOfStock,
        risk,
      },
    ] as const;
    }),
  );
}

export const defaultSupplyNetworkFilters: SupplyNetworkFilters = {
  county: "all",
  medicine: "all",
  stockStatus: "all",
  risk: "all",
};

function matchesRiskFilter(facilityRiskById: ReturnType<typeof buildFacilityRiskById>, clinicId: string, riskFilter: string) {
  if (riskFilter === "all") return true;
  return facilityRiskById.get(clinicId)?.risk === riskFilter;
}

function buildStatusTone(status: StockStatus) {
  if (status === "Out of Stock") return "rose" as const;
  if (status === "Low Stock") return "amber" as const;
  return "teal" as const;
}

function formatRiskLabel(risk: string) {
  if (risk === "severe") return "Heightened shortage risk";
  if (risk === "watch") return "Watchlist";
  return "Stable coverage";
}

export function buildSupplyNetworkData(
  filters: SupplyNetworkFilters,
  source: SupplyNetworkSource = { clinics, inventoryRows, medicines, stockRequests },
): SupplyNetworkData {
  const countyOptions: SupplyGraphOption[] = [
    { label: "All counties", value: "all" },
    ...Array.from(new Set(source.clinics.map((clinic) => clinic.county)))
      .sort((left, right) => left.localeCompare(right))
      .map((county) => ({ label: county, value: county })),
  ];

  const medicineOptions: SupplyGraphOption[] = [
    { label: "All essential medicines", value: "all" },
    ...source.medicines
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((medicine) => ({ label: medicine.name, value: medicine.id })),
  ];

  const facilityRiskById = buildFacilityRiskById(source.clinics);

  const filteredFacilities = source.clinics
    .filter((clinic) => (filters.county === "all" ? true : clinic.county === filters.county))
    .filter((clinic) => matchesRiskFilter(facilityRiskById, clinic.id, filters.risk))
    .filter((clinic) =>
      clinic.inventory.some((item) => {
        const matchesMedicine = filters.medicine === "all" ? true : item.medicineId === filters.medicine;
        const matchesStatus = filters.stockStatus === "all" ? true : item.status === filters.stockStatus;
        return matchesMedicine && matchesStatus;
      }),
    )
    .sort((left, right) => {
      const leftRisk = facilityRiskById.get(left.id);
      const rightRisk = facilityRiskById.get(right.id);
      const severityDelta =
        (rightRisk?.outOfStock ?? 0) - (leftRisk?.outOfStock ?? 0) ||
        (rightRisk?.lowStock ?? 0) - (leftRisk?.lowStock ?? 0);

      if (severityDelta !== 0) return severityDelta;
      return left.name.localeCompare(right.name);
    })
    .slice(0, MAX_VISIBLE_FACILITIES);

  const visibleFacilityIds = new Set(filteredFacilities.map((facility) => facility.id));

  const visibleInventoryRows = source.inventoryRows.filter((row) => {
    if (!visibleFacilityIds.has(row.clinicId)) return false;
    if (filters.medicine !== "all") {
      const matchesMedicine = filteredFacilities
        .find((facility) => facility.id === row.clinicId)
        ?.inventory.some((item) => item.medicineId === filters.medicine && item.medicineName === row.medicineName);

      if (!matchesMedicine) return false;
    }

    if (filters.stockStatus !== "all" && row.status !== filters.stockStatus) return false;
    return true;
  });

  const visibleMedicines = Array.from(
    visibleInventoryRows.reduce<
      Map<
        string,
        {
          id: string;
          name: string;
          lowStock: number;
          outOfStock: number;
          facilityCount: number;
        }
      >
    >((summary, row) => {
      const sourceFacility = filteredFacilities.find((facility) => facility.id === row.clinicId);
      const matchingItem = sourceFacility?.inventory.find((item) => item.medicineName === row.medicineName);

      if (!matchingItem) return summary;

      const current = summary.get(matchingItem.medicineId) ?? {
        id: matchingItem.medicineId,
        name: matchingItem.medicineName,
        lowStock: 0,
        outOfStock: 0,
        facilityCount: 0,
      };

      if (row.status === "Low Stock") current.lowStock += 1;
      if (row.status === "Out of Stock") current.outOfStock += 1;
      current.facilityCount += 1;
      summary.set(matchingItem.medicineId, current);
      return summary;
    }, new Map()),
  )
    .map(([, value]) => value)
    .sort(
      (left, right) =>
        right.outOfStock - left.outOfStock ||
        right.lowStock - left.lowStock ||
        right.facilityCount - left.facilityCount,
    )
    .slice(0, filters.medicine === "all" ? 8 : 3);

  const visibleMedicineIds = new Set(visibleMedicines.map((medicine) => medicine.id));

  const statusSummary = visibleInventoryRows.reduce<Record<StockStatus, number>>(
    (summary, row) => {
      const matchingFacility = filteredFacilities.find((facility) => facility.id === row.clinicId);
      const matchingItem = matchingFacility?.inventory.find((item) => item.medicineName === row.medicineName);
      if (!matchingItem || !visibleMedicineIds.has(matchingItem.medicineId)) return summary;

      summary[row.status] += 1;
      return summary;
    },
    {
      "In Stock": 0,
      "Low Stock": 0,
      "Out of Stock": 0,
    },
  );

  const visibleCounties = Array.from(new Set(filteredFacilities.map((facility) => facility.county)));

  const visibleRequests = source.stockRequests.filter((request) => {
    const clinic = filteredFacilities.find((facility) => facility.name === request.clinicName);
    if (!clinic) return false;
    if (filters.medicine === "all") return true;
    return clinic.inventory.some((item) => item.medicineId === filters.medicine && item.medicineName === request.medicineName);
  });

  const countyRiskNodes = visibleCounties.map((county) => {
    const countyFacilities = filteredFacilities.filter((facility) => facility.county === county);
    const outOfStock = countyFacilities.reduce(
      (total, facility) => total + (facilityRiskById.get(facility.id)?.outOfStock ?? 0),
      0,
    );
    const lowStock = countyFacilities.reduce(
      (total, facility) => total + (facilityRiskById.get(facility.id)?.lowStock ?? 0),
      0,
    );
    const risk = outOfStock > 0 ? "severe" : lowStock > 0 ? "watch" : "stable";

    return {
      county,
      risk,
      outOfStock,
      lowStock,
      facilityCount: countyFacilities.length,
    };
  });

  const nodes: SupplyGraphNode[] = [
    ...visibleCounties.map((county) => {
      const facilityCount = filteredFacilities.filter((facility) => facility.county === county).length;
      return {
        id: `county:${county}`,
        kind: "county" as const,
        label: "County",
        title: county,
        subtitle: `${facilityCount} facilities in view`,
        tone: "sky" as const,
        tags: ["Open facility context", "Kenya demo"],
        detailLines: [
          `${county} is part of the Kenya supply-network sample in MediStock.`,
          "Facility records come from a curated Kenya demo dataset that keeps runtime data lightweight and easy to inspect.",
        ],
        metrics: [
          { label: "Facilities", value: String(facilityCount) },
          {
            label: "Requests",
            value: String(
              visibleRequests.filter(
                (request) =>
                  filteredFacilities.find((facility) => facility.name === request.clinicName)?.county === county,
              ).length,
            ),
          },
        ],
      };
    }),
    ...filteredFacilities.map((facility) => {
      const riskData = facilityRiskById.get(facility.id);
      const filteredInventory = facility.inventory.filter((item) => {
        const matchesMedicine = filters.medicine === "all" ? true : item.medicineId === filters.medicine;
        const matchesStatus = filters.stockStatus === "all" ? true : item.status === filters.stockStatus;
        return matchesMedicine && matchesStatus;
      });
      const facilityTone: SupplyGraphNode["tone"] = riskData?.outOfStock
        ? "rose"
        : riskData?.lowStock
          ? "amber"
          : "teal";

      return {
        id: `facility:${facility.id}`,
        kind: "facility" as const,
        label: facility.facilityType,
        title: facility.name,
        subtitle: `${facility.county}${facility.subCounty ? ` - ${facility.subCounty}` : ""}`,
        tone: facilityTone,
        tags: [
          facility.facilityType,
          facility.ownership ?? "Ownership not listed",
          "Demo inventory",
        ],
        detailLines: [
          facility.address,
          `${filteredInventory.length} matching medicine records are visible for this graph view.`,
        ],
        metrics: [
          { label: "Low stock", value: String(riskData?.lowStock ?? 0) },
          { label: "Out of stock", value: String(riskData?.outOfStock ?? 0) },
        ],
      };
    }),
    ...visibleMedicines.map((medicine) => {
      const medicineTone: SupplyGraphNode["tone"] = medicine.outOfStock
        ? "rose"
        : medicine.lowStock
          ? "amber"
          : "teal";

      return {
        id: `medicine:${medicine.id}`,
        kind: "medicine" as const,
        label: "Essential medicine",
        title: medicine.name,
        subtitle: `${medicine.facilityCount} facility links in view`,
        tone: medicineTone,
        tags: ["WHO-inspired concept", "Demo inventory"],
        detailLines: [
          "Medicine names are based on essential medicine concepts used for the MediStock Kenya demo.",
          "Displayed stock is simulated and not real-time.",
        ],
        metrics: [
          { label: "Low stock links", value: String(medicine.lowStock) },
          { label: "Out-of-stock links", value: String(medicine.outOfStock) },
        ],
      };
    }),
    ...Object.entries(statusSummary)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        id: `status:${status}`,
        kind: "status" as const,
        label: "Stock status",
        title: status,
        subtitle: `${count} visible medicine links`,
        tone: buildStatusTone(status as StockStatus),
        tags: ["Demo inventory status"],
        detailLines: [
          `${status} summarizes simulated inventory links for the active filters.`,
          "Status is operational demo data only and does not indicate real-time availability.",
        ],
        metrics: [{ label: "Links", value: String(count) }],
      })),
    ...visibleRequests.map((request) => ({
      id: `request:${request.id}`,
      kind: "request" as const,
      label: request.status,
      title: request.id,
      subtitle: request.medicineName,
      tone: (request.status === "Reviewing" ? "amber" : "sky") as SupplyGraphNode["tone"],
      tags: ["Citizen request flow", "Demo workflow"],
      detailLines: [
        `${request.clinicName} is requesting support for ${request.medicineName}.`,
        "Requests are simulated to show how demand pressure can connect to supply visibility.",
      ],
      metrics: [{ label: "Requested qty", value: String(request.quantityRequested) }],
    })),
    ...countyRiskNodes.map((risk) => {
      const riskTone: SupplyGraphNode["tone"] =
        risk.risk === "severe" ? "rose" : risk.risk === "watch" ? "amber" : "teal";

      return {
        id: `risk:${risk.county}`,
        kind: "risk" as const,
        label: formatRiskLabel(risk.risk),
        title: `${risk.county} shortage signal`,
        subtitle:
          risk.risk === "severe"
            ? "Out-of-stock records are present in this county sample."
            : risk.risk === "watch"
              ? "Low-stock records are present in this county sample."
              : "No filtered shortages are visible in this graph view.",
        tone: riskTone,
        tags: ["Operational alert", "Demo risk"],
        detailLines: [
          "Risk alerts summarize the current filtered view of simulated stock pressure.",
          "They help explain where low stock may contribute to supply strain without implying real-time surveillance.",
        ],
        metrics: [
          { label: "Facilities", value: String(risk.facilityCount) },
          { label: "Out-of-stock", value: String(risk.outOfStock) },
          { label: "Low stock", value: String(risk.lowStock) },
        ],
      };
    }),
  ];

  const edges = [
    ...filteredFacilities.map(
      (facility): SupplyGraphEdge => ({
      id: `edge:county:${facility.county}:${facility.id}`,
      from: `county:${facility.county}`,
      to: `facility:${facility.id}`,
      label: "contains facility",
      tone: "sky" as const,
      }),
    ),
    ...filteredFacilities.flatMap((facility) =>
      facility.inventory
        .filter((item) => {
          const matchesMedicine = filters.medicine === "all" ? true : item.medicineId === filters.medicine;
          const matchesStatus = filters.stockStatus === "all" ? true : item.status === filters.stockStatus;
          return matchesMedicine && matchesStatus && visibleMedicineIds.has(item.medicineId);
        })
        .slice(0, filters.medicine === "all" ? 2 : 4)
        .map(
          (item): SupplyGraphEdge => ({
          id: `edge:facility:${facility.id}:medicine:${item.medicineId}`,
          from: `facility:${facility.id}`,
          to: `medicine:${item.medicineId}`,
          label: `stocks ${item.quantity}`,
          tone: buildStatusTone(item.status),
          }),
        ),
    ),
    ...visibleMedicines.flatMap((medicine) =>
      (Object.entries(statusSummary) as [StockStatus, number][])
        .filter(([status]) =>
          visibleInventoryRows.some((row) => {
            const facility = filteredFacilities.find((entry) => entry.id === row.clinicId);
            const item = facility?.inventory.find((entry) => entry.medicineName === row.medicineName);
            return item?.medicineId === medicine.id && row.status === status;
          }),
        )
        .map(
          ([status]): SupplyGraphEdge => ({
          id: `edge:medicine:${medicine.id}:status:${status}`,
          from: `medicine:${medicine.id}`,
          to: `status:${status}`,
          label: "has stock status",
          tone: buildStatusTone(status),
          }),
        ),
    ),
    ...visibleRequests.flatMap((request) => {
      const medicine = source.medicines.find((entry) => entry.name === request.medicineName);
      if (!medicine || !visibleMedicineIds.has(medicine.id)) return [];

      return [
        {
          id: `edge:request:${request.id}:medicine:${medicine.id}`,
          from: `request:${request.id}`,
          to: `medicine:${medicine.id}`,
          label: "targets medicine",
          tone: "amber" as const,
        },
      ];
    }),
    ...countyRiskNodes.flatMap((risk) =>
      (["Low Stock", "Out of Stock"] as StockStatus[])
        .filter((status) => statusSummary[status] > 0)
        .map((status): SupplyGraphEdge => ({
          id: `edge:status:${status}:risk:${risk.county}`,
          from: `status:${status}`,
          to: `risk:${risk.county}`,
          label: "contributes to shortage risk",
          tone: status === "Out of Stock" ? "rose" : "amber",
        })),
    ),
  ] satisfies SupplyGraphEdge[];

  return {
    nodes,
    edges,
    summary: {
      facilityCount: filteredFacilities.length,
      medicineCount: visibleMedicines.length,
      requestCount: visibleRequests.length,
      riskCount: countyRiskNodes.length,
      inventoryRecordCount: visibleInventoryRows.length,
    },
    options: {
      county: countyOptions,
      medicine: medicineOptions,
      stockStatus: stockOptions,
      risk: riskOptions,
    },
  };
}

export function getConnectedNodeIds(nodeId: string, edges: SupplyGraphEdge[]) {
  const connected = new Set<string>([nodeId]);

  for (const edge of edges) {
    if (edge.from === nodeId) connected.add(edge.to);
    if (edge.to === nodeId) connected.add(edge.from);
  }

  return connected;
}
