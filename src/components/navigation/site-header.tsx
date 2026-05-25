import Link from "next/link";

import { navigationLinks } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-600 text-sm font-semibold text-white shadow-sm">
              MS
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">MediStock</p>
              <p className="text-sm text-slate-500">Kenya health access and demo supply navigator</p>
            </div>
          </Link>
          <div className="hidden rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm text-teal-800 sm:block">
            SDG 3 healthcare access navigator
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "rounded-full text-slate-700 hover:bg-teal-50 hover:text-teal-900",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
