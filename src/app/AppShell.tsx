"use client";

import { Analytics } from "@vercel/analytics/react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Layout } from "@/components/Layout";

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
    <motion.div
      animate="show"
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      viewport={{ once: true }}
      whileInView="show"
    >
      <div className="relative">
        <main>
          <Layout>
            {children}
            <Analytics />
          </Layout>
        </main>
      </div>
    </motion.div>
  );
}
