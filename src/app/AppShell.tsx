"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Layout } from "@/components/Layout";

const Analytics = dynamic(
  () =>
    import("@vercel/analytics/react").then((m) => ({ default: m.Analytics })),
  { ssr: false }
);

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const _previousPathname = usePrevious(pathname);

  return (
    <div className="relative">
      <main>
        <Layout>
          {children}
          <Analytics />
        </Layout>
      </main>
    </div>
  );
}
