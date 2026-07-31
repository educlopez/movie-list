import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Series de televisión que se emiten hoy",
  title: "En emisión hoy",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
