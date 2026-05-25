"use client";

import { useEffect, useMemo, useState } from "react";

import { demoInventory } from "@/data/demo-inventory";
import { buildDemoData } from "@/data/mock-data";
import type { DemoInventoryRecord } from "@/types/medistock";

const STORAGE_KEY = "medistock-demo-inventory";
const EVENT_NAME = "medistock-demo-inventory-updated";

function isDemoInventoryRecord(value: unknown): value is DemoInventoryRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as DemoInventoryRecord;
  return Boolean(
    typeof record.facilityId === "string" &&
      typeof record.medicineId === "string" &&
      typeof record.medicineName === "string" &&
      typeof record.quantity === "number" &&
      typeof record.status === "string" &&
      typeof record.updatedAt === "string" &&
      record.isDemo === true,
  );
}

export function loadDemoInventoryState() {
  if (typeof window === "undefined") return demoInventory;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return demoInventory;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return demoInventory;
    const records = parsed.filter(isDemoInventoryRecord);
    return records.length ? records : demoInventory;
  } catch {
    return demoInventory;
  }
}

function persistDemoInventoryState(records: DemoInventoryRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function upsertDemoInventoryRecords(updates: DemoInventoryRecord[]) {
  const current = loadDemoInventoryState();
  const next = current.slice();

  for (const update of updates) {
    const existingIndex = next.findIndex(
      (record) => record.facilityId === update.facilityId && record.medicineId === update.medicineId,
    );

    if (existingIndex === -1) {
      next.unshift(update);
    } else {
      next[existingIndex] = update;
    }
  }

  persistDemoInventoryState(next);
  return next;
}

export function useDemoInventoryState() {
  const [records, setRecords] = useState<DemoInventoryRecord[]>(() => loadDemoInventoryState());

  useEffect(() => {
    const handleUpdate = () => setRecords(loadDemoInventoryState());
    window.addEventListener(EVENT_NAME, handleUpdate as EventListener);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate as EventListener);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const snapshot = useMemo(() => buildDemoData(records), [records]);

  return {
    records,
    snapshot,
    saveUpdates: (updates: DemoInventoryRecord[]) => {
      const next = upsertDemoInventoryRecords(updates);
      setRecords(next);
      return next;
    },
  };
}
