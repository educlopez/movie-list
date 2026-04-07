"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import bgRayDark from "@/images/bg-ray-dark.png";
import bgRayLight from "@/images/bg-ray-light.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative overflow-hidden">
      <Image
        alt="Background ray for light mode"
        className="absolute top-0 left-1/2 -ml-[39rem] w-[113.125rem] max-w-none dark:hidden"
        height={502}
        priority
        src={bgRayLight}
        width={1810}
      />
      <Image
        alt="Background ray for dark mode"
        className="absolute top-0 left-1/2 -ml-[39rem] hidden w-[113.125rem] max-w-none dark:block"
        height={502}
        priority
        src={bgRayDark}
        width={1810}
      />
      <motion.header layoutScroll>
        <Header />
      </motion.header>
      <div className="container relative mx-auto space-y-10 px-4 pt-14 pb-16 sm:px-6 lg:px-8">
        <main className="py-16">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
