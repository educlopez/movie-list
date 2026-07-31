import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Las series de televisión más populares del momento",
  title: "Series populares",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
