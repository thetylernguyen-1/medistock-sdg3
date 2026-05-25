import Link from "next/link";

import { MedicalDisclaimer } from "@/components/cards/medical-disclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EducationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Education</h1>
        <p className="max-w-3xl text-slate-600">
          Plain-language guidance to help citizens and clinic teams use Kenya facility
          context and demo inventory information responsibly.
        </p>
      </div>

      <Tabs defaultValue="citizens" className="gap-4">
        <TabsList>
          <TabsTrigger value="citizens">Citizens</TabsTrigger>
          <TabsTrigger value="staff">Clinic staff</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>
        <TabsContent value="citizens">
          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle>Using stock information safely</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
              <p>Call ahead when possible to confirm stock before traveling.</p>
              <p>Ask a licensed healthcare professional if you are unsure whether a medicine is suitable for you.</p>
              <p>Do not use this app to self-diagnose or change a treatment plan.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff">
          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle>Operational reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
              <p>Update counts promptly to reduce unnecessary travel for the public.</p>
              <p>Use consistent naming for medicines and vaccines.</p>
              <p>Share only inventory information, never personal patient details.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emergency">
          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle>Emergency situations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
              <p>For urgent symptoms, contact local emergency services immediately.</p>
              <p>This app cannot assess symptoms, urgency, or treatment needs.</p>
              <p>Use it only as a stock visibility tool alongside professional guidance.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>How to read the Kenya demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
          <p>Facility locations are based on open Kenya health-facility mapping data.</p>
          <p>Medicine names are based on essential medicine concepts, but stock counts are simulated for demonstration only.</p>
          <p>
            Visit the{" "}
            <Link href="/data-sources" className="font-medium text-teal-700 hover:text-teal-900">
              Data Sources
            </Link>{" "}
            page for the full explanation of what is real, what is demo-only, and what is not medical advice.
          </p>
        </CardContent>
      </Card>

      <MedicalDisclaimer />
    </div>
  );
}
