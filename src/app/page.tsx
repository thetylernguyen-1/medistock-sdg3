import Link from "next/link";
import { ArrowRight, CircleAlert, Hospital, PackageSearch, Pill } from "lucide-react";

import { StatCard } from "@/components/cards/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { clinics, dashboardMetrics, medicines } from "@/data/mock-data";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="animate__animated animate__fadeInUp animate__faster grid gap-6 rounded-[2rem] border border-teal-100 bg-white/95 p-8 shadow-[0_24px_60px_-40px_rgba(15,118,110,0.45)] lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <Badge className="rounded-full bg-teal-100 px-3 py-1 text-teal-900 hover:bg-teal-100">
            SDG 3 health access prototype
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Find nearby medicine and vaccine stock with more clarity and less friction.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              MediStock helps citizens locate available essentials and gives clinics a
              simple way to share inventory updates, request support, and surface
              shortage risks early.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/find-medicine"
              className={cn(buttonVariants(), "h-11 rounded-full bg-teal-600 px-5 hover:bg-teal-700")}
            >
              Find medicine
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}
            >
              View dashboard
            </Link>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-sm text-sky-950">
            <CircleAlert className="mt-0.5 size-5 text-sky-700" />
            <p>
              Public health information shown here is educational and operational only.
              It does not replace advice from a doctor, pharmacist, or nurse.
            </p>
          </div>
        </div>
        <Card className="border-none bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-700 text-white shadow-none">
          <CardHeader>
            <CardTitle className="text-white">Today&apos;s quick view</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/12 px-4 py-3">
                <span>Nearby clinics</span>
                <span className="text-xl font-semibold">{clinics.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/12 px-4 py-3">
                <span>Tracked medicines</span>
                <span className="text-xl font-semibold">{medicines.length}</span>
              </div>
            </div>
            <Separator className="bg-white/20" />
            <div className="grid gap-3 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <Hospital className="size-4" />
                Clinics can publish low-stock alerts clearly.
              </div>
              <div className="flex items-center gap-3">
                <PackageSearch className="size-4" />
                Citizens can compare locations before traveling.
              </div>
              <div className="flex items-center gap-3">
                <Pill className="size-4" />
                Inventory language stays simple and non-diagnostic.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <StatCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Find Medicine",
            description: "Browse essentials by clinic, distance, and stock status.",
            href: "/find-medicine",
          },
          {
            title: "Update Stock",
            description: "Let clinic staff report inventory changes with a simple form.",
            href: "/update-stock",
          },
          {
            title: "Education",
            description: "Share plain-language guidance and route emergencies correctly.",
            href: "/education",
          },
        ].map((item) => (
          <Card key={item.href} className="border-slate-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-slate-600">{item.description}</p>
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
              >
                Open page <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
