import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { MedicalDisclaimer } from "@/components/cards/medical-disclaimer";
import { BulkDemoUpdatePanel } from "@/components/forms/bulk-demo-update-panel";
import { StockFormPreview } from "@/components/forms/stock-form-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UpdateStockPage() {
  const showPrototypeNote =
    process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true" || process.env.NODE_ENV !== "production";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Update Stock</h1>
          <p className="text-slate-600">
            A lightweight staff workflow for recording stock changes against the Kenya
            facility sample and keeping medicine availability visible to the community.
          </p>
        </div>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Staff notes</CardTitle>
              <DemoInventoryBadge />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
            <p>Use Kenya facility context with demo inventory only in this prototype.</p>
            <p>Keep quantity updates simple, readable, and easy to verify.</p>
            <p>Do not store patient-identifying details in stock update flows.</p>
          </CardContent>
        </Card>
        {showPrototypeNote ? (
          <Alert className="border-sky-200 bg-sky-50 text-sky-950">
            <AlertTitle>Developer testing note</AlertTitle>
            <AlertDescription>
              1. Select a Kenya facility.
              <br />
              2. Select Paracetamol.
              <br />
              3. Set quantity to 0.
              <br />
              4. Save update.
              <br />
              5. Confirm the success message appears.
              <br />
              6. Confirm the status becomes out-of-stock.
              <br />
              7. Confirm the changed status appears on Find Medicine and Dashboard if demo state persistence is enabled.
            </AlertDescription>
          </Alert>
        ) : null}
        <MedicalDisclaimer />
      </div>
      <div className="space-y-4">
        <Tabs defaultValue="single" className="gap-4">
          <TabsList>
            <TabsTrigger value="single">Single facility update</TabsTrigger>
            {showPrototypeNote ? <TabsTrigger value="bulk">Bulk demo update</TabsTrigger> : null}
          </TabsList>
          <TabsContent value="single">
            <StockFormPreview />
          </TabsContent>
          {showPrototypeNote ? (
            <TabsContent value="bulk">
              <BulkDemoUpdatePanel />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </div>
  );
}
