import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MedicalDisclaimer() {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-950">
      <AlertCircle className="text-amber-700" />
      <AlertTitle>This app does not provide medical advice.</AlertTitle>
      <AlertDescription>
        MediStock shares stock visibility and public health information only. For
        medication choices, treatment decisions, or emergencies, contact a
        qualified healthcare professional or local emergency services.
      </AlertDescription>
    </Alert>
  );
}
