"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SDGImpactCard() {
  return (
    <Card className="border-slate-200 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle>How this supports SDG 3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          This tool supports SDG 3 by improving access to essential healthcare services.
          It helps users identify facilities that match their health needs, reduces friction
          in patient navigation, and can prioritize nearby services when location access is allowed.
          The main SDG target addressed is SDG 3.8: universal access to essential healthcare services.
        </p>
        <p>It also supports prevention and early support through health category guidance.</p>
        <p>It includes dedicated mental health support categories to strengthen well-being.</p>
        <p>It can improve health-system efficiency through structured facility matching and clearer service discovery.</p>
      </CardContent>
    </Card>
  );
}
