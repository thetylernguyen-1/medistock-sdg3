import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type RawFeature = {
  geometry?: {
    type?: string;
    coordinates?: [number, number];
  };
  properties?: Record<string, string | number | null | undefined>;
};

type RawCollection = {
  features?: RawFeature[];
};

type CleanFacility = {
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
  source: "HOTOSM Kenya Health Facilities";
};

const INPUT_PATH = resolve("data/raw/kenya-health-facilities.geojson");
const OUTPUT_PATH = resolve("src/data/kenya-facilities.ts");

const TARGET_COUNTS: Record<string, number> = {
  Nairobi: 20,
  Mombasa: 15,
  Kisumu: 15,
  Turkana: 10,
};

const COUNTY_RULES = [
  {
    county: "Nairobi",
    keywords: ["nairobi", "karen", "embakasi", "kibra", "langata", "kasarani", "dagoretti", "westlands"],
    bbox: { minLat: -1.45, maxLat: -1.16, minLon: 36.67, maxLon: 37.02 },
  },
  {
    county: "Mombasa",
    keywords: ["mombasa", "likoni", "nyali", "kisauni", "changamwe", "port reitz", "miritini", "magogoni"],
    bbox: { minLat: -4.18, maxLat: -3.9, minLon: 39.56, maxLon: 39.77 },
  },
  {
    county: "Kisumu",
    keywords: ["kisumu", "nyanza", "obunga", "manyatta", "kondele", "nyalenda", "maseno"],
    bbox: { minLat: -0.2, maxLat: 0.12, minLon: 34.6, maxLon: 35.0 },
  },
  {
    county: "Turkana",
    keywords: ["turkana", "kakuma", "kalobeyei", "lodwar", "oropoi", "lokichoggio", "lokichar"],
    bbox: { minLat: 1.9, maxLat: 4.8, minLon: 34.55, maxLon: 35.95 },
  },
] as const;

const GENERIC_NAMES = new Set([
  "chemist",
  "clinic",
  "hospital",
  "medical clinic",
  "medical centre",
  "medical center",
  "pharmacy",
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string) {
  return value
    .split(/[\s_:-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isHumanHealthFacility(name: string, facilityHint: string) {
  const haystack = `${name} ${facilityHint}`.toLowerCase();
  return ![
    "animal",
    "veterinary",
    "livestock",
    "faith healer",
    "alternative",
    "dental lab",
  ].some((token) => haystack.includes(token));
}

function inferCounty(props: Record<string, string | number | null | undefined>, latitude: number, longitude: number) {
  const addressText = [props["addr:city"], props["addr:full"]]
    .map(normalizeText)
    .join(" ")
    .toLowerCase();
  const nameText = [props.name, props["name:en"], props["name:sw"]]
    .map(normalizeText)
    .join(" ")
    .toLowerCase();

  for (const rule of COUNTY_RULES) {
    if (rule.keywords.some((keyword) => addressText.includes(keyword))) {
      return rule.county;
    }
  }

  for (const rule of COUNTY_RULES) {
    if (nameText.includes(rule.county.toLowerCase())) {
      return rule.county;
    }
  }

  for (const rule of COUNTY_RULES) {
    const { minLat, maxLat, minLon, maxLon } = rule.bbox;
    if (latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon) {
      return rule.county;
    }
  }

  return null;
}

function inferFacilityType(props: Record<string, string | number | null | undefined>, name: string) {
  const raw = [props.healthcare, props.amenity, name].map(normalizeText).join(" ").toLowerCase();

  if (raw.includes("dispensary")) return "Dispensary";
  if (raw.includes("hospital")) return "Hospital";
  if (raw.includes("health centre") || raw.includes("health center")) return "Health centre";
  if (raw.includes("medical centre") || raw.includes("medical center")) return "Medical centre";
  if (raw.includes("clinic")) return "Clinic";
  if (raw.includes("pharmacy") || raw.includes("chemist")) return "Pharmacy";

  return null;
}

function inferOwnership(value: string) {
  const normalized = value.toLowerCase();
  const ownershipMap: Record<string, string> = {
    ministry_of_health: "Public",
    private: "Private",
    religious: "Faith-based",
    ngo: "NGO",
    charity: "Charitable",
    community: "Community",
  };

  return ownershipMap[normalized] ?? titleCase(normalized);
}

function inferSubCounty(city: string, county: string) {
  if (!city) return undefined;
  const normalizedCity = city.toLowerCase();
  if (normalizedCity === county.toLowerCase()) return undefined;
  return titleCase(city);
}

function buildServices(facilityType: string, specialityValue: string) {
  const baseServices: Record<string, string[]> = {
    Hospital: ["Outpatient care", "Maternal health", "Vaccination"],
    Clinic: ["Primary care", "Vaccination", "Referral support"],
    "Health centre": ["Primary care", "Immunization", "Maternal health"],
    "Medical centre": ["Primary care", "Outpatient care", "Referral support"],
    Dispensary: ["Basic treatment", "Dispensing", "Community referral"],
    Pharmacy: ["Dispensing", "Health information", "Referral support"],
  };

  const services = new Set(baseServices[facilityType] ?? ["Primary care"]);
  for (const item of specialityValue.split(";")) {
    const value = item.trim().toLowerCase();
    if (!value) continue;
    if (value.includes("vaccination")) services.add("Vaccination");
    if (value.includes("gynaecology")) services.add("Maternal health");
    if (value.includes("emergency")) services.add("Urgent care");
    if (value.includes("blood")) services.add("Laboratory support");
    if (value.includes("dental")) services.add("Dental care");
    if (value.includes("dermatology")) services.add("Specialist clinic");
  }

  return [...services].slice(0, 4);
}

function scoreFacility(facility: CleanFacility) {
  const typeScore: Record<string, number> = {
    Hospital: 6,
    "Health centre": 5,
    "Medical centre": 5,
    Clinic: 4,
    Dispensary: 4,
    Pharmacy: 3,
  };

  let score = typeScore[facility.facilityType] ?? 1;
  if (facility.ownership) score += 1;
  if (facility.subCounty) score += 1;
  if (facility.addressOrArea) score += 1;
  if (facility.name.split(/\s+/).length >= 2) score += 1;
  return score;
}

function cleanFeature(feature: RawFeature) {
  const props = feature.properties ?? {};
  const geometry = feature.geometry;
  const [longitude, latitude] = geometry?.coordinates ?? [];
  const name = normalizeText(props.name || props["name:en"] || props["name:sw"]);

  if (geometry?.type !== "Point" || typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  if (!name || GENERIC_NAMES.has(name.toLowerCase())) {
    return null;
  }

  const facilityType = inferFacilityType(props, name);
  if (!facilityType || !isHumanHealthFacility(name, `${props.healthcare ?? ""} ${props.amenity ?? ""}`)) {
    return null;
  }

  const county = inferCounty(props, latitude, longitude);
  if (!county) {
    return null;
  }

  const city = normalizeText(props["addr:city"]);
  const address = normalizeText(props["addr:full"]) || city || undefined;
  const ownership = normalizeText(props["operator:type"]);
  const specialityValue = normalizeText(props["healthcare:speciality"]);
  const osmId = String(props.osm_id ?? `${county}-${name}`);

  return {
    id: `${slugify(county)}-${slugify(name)}-${slugify(osmId)}`,
    name,
    facilityType,
    county,
    subCounty: inferSubCounty(city, county),
    addressOrArea: address,
    latitude,
    longitude,
    ownership: ownership ? inferOwnership(ownership) : undefined,
    services: buildServices(facilityType, specialityValue),
    source: "HOTOSM Kenya Health Facilities" as const,
  } satisfies CleanFacility;
}

function selectFacilities(facilities: CleanFacility[]) {
  const selected: CleanFacility[] = [];

  for (const county of Object.keys(TARGET_COUNTS)) {
    const countyFacilities = facilities
      .filter((facility) => facility.county === county)
      .sort((left, right) => {
        const scoreDelta = scoreFacility(right) - scoreFacility(left);
        if (scoreDelta !== 0) return scoreDelta;
        return left.name.localeCompare(right.name);
      });

    selected.push(...countyFacilities.slice(0, TARGET_COUNTS[county]));
  }

  return selected.sort((left, right) => {
    const countyDelta = left.county.localeCompare(right.county);
    if (countyDelta !== 0) return countyDelta;
    return left.name.localeCompare(right.name);
  });
}

function main() {
  const raw = readFileSync(INPUT_PATH, "utf8");
  const geojson = JSON.parse(raw) as RawCollection;
  const features = Array.isArray(geojson.features) ? geojson.features : [];

  const cleanedFacilities = features.flatMap((feature) => {
    const facility = cleanFeature(feature);
    return facility ? [facility] : [];
  });

  const dedupedFacilities = Array.from(
    new Map(cleanedFacilities.map((facility) => [`${facility.county}:${facility.name.toLowerCase()}`, facility])).values(),
  );

  const selectedFacilities = selectFacilities(dedupedFacilities);

  const output = `import type { KenyaFacility } from "@/types/medistock";

// Generated by scripts/extract-kenya-facilities.ts from data/raw/kenya-health-facilities.geojson
export const kenyaFacilities = ${JSON.stringify(selectedFacilities, null, 2)} satisfies KenyaFacility[];
`;

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, output);

  console.log(`Wrote ${selectedFacilities.length} Kenya facilities to ${OUTPUT_PATH}`);
}

main();
