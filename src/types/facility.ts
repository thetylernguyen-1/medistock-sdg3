export type ServiceTag =
  | "general"
  | "mental-health"
  | "maternal-care"
  | "child-care"
  | "vaccination"
  | "emergency"
  | "pharmacy"
  | "chronic-care";

export type HealthNeedCategoryId = ServiceTag;

export type HealthNeedCategory = {
  id: HealthNeedCategoryId;
  label: string;
  guidance: string;
};

export type FacilityProfile = {
  id: string;
  name: string;
  facilityType: string;
  county: string;
  subCounty?: string;
  areaOrAddress: string;
  latitude: number;
  longitude: number;
  ownership?: string;
  serviceTags: ServiceTag[];
  availabilityNote: string;
  description: string;
  source: "MediStock Kenya Demo Facilities";
};
