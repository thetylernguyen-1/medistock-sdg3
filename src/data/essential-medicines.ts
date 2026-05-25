import type { Medicine } from "@/types/medistock";

export const essentialMedicines = [
  { id: "paracetamol", name: "Paracetamol", category: "Pain relief", form: "Tablets" },
  { id: "amoxicillin", name: "Amoxicillin", category: "Antibiotic", form: "Capsules" },
  { id: "ors", name: "Oral rehydration salts", category: "Hydration", form: "Sachets" },
  { id: "zinc-sulfate", name: "Zinc sulfate", category: "Child health", form: "Tablets" },
  { id: "artemether-lumefantrine", name: "Artemether-lumefantrine", category: "Malaria", form: "Tablets" },
  { id: "ceftriaxone", name: "Ceftriaxone", category: "Antibiotic", form: "Injection" },
  { id: "salbutamol", name: "Salbutamol inhaler", category: "Respiratory", form: "Inhaler" },
  { id: "amlodipine", name: "Amlodipine", category: "Cardiovascular", form: "Tablets" },
  { id: "metformin", name: "Metformin", category: "Diabetes", form: "Tablets" },
  { id: "insulin-regular", name: "Regular insulin", category: "Diabetes", form: "Injection" },
  { id: "oxytocin", name: "Oxytocin", category: "Maternal health", form: "Injection" },
  { id: "magnesium-sulfate", name: "Magnesium sulfate", category: "Maternal health", form: "Injection" },
  { id: "ferrous-folic", name: "Ferrous sulfate + folic acid", category: "Maternal health", form: "Tablets" },
  { id: "bcg", name: "BCG vaccine", category: "Vaccine", form: "Injection" },
  { id: "pentavalent", name: "Pentavalent vaccine", category: "Vaccine", form: "Injection" },
  { id: "polio", name: "Polio vaccine", category: "Vaccine", form: "Oral drops" },
  { id: "measles-rubella", name: "Measles-rubella vaccine", category: "Vaccine", form: "Injection" },
  { id: "tetanus", name: "Tetanus toxoid vaccine", category: "Vaccine", form: "Injection" },
  { id: "hepatitis-b", name: "Hepatitis B vaccine", category: "Vaccine", form: "Injection" },
  { id: "rabies", name: "Rabies vaccine", category: "Vaccine", form: "Injection" },
] satisfies Medicine[];
