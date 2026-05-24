import { MedicalDisclaimer } from "@/components/cards/medical-disclaimer";
import { StockFormPreview } from "@/components/forms/stock-form-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdateStockPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Update Stock</h1>
          <p className="text-slate-600">
            A lightweight staff workflow for recording stock changes and keeping
            medicine availability visible to the community.
          </p>
        </div>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>Staff notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
            <p>Use mock data only in this prototype.</p>
            <p>Keep quantity updates simple, readable, and easy to verify.</p>
            <p>Do not store patient-identifying details in stock update flows.</p>
          </CardContent>
        </Card>
        <MedicalDisclaimer />
      </div>
      <StockFormPreview />
    </div>
  );
}
