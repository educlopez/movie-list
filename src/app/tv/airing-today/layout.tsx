import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "En emisión hoy",
  description: "Series de televisión que se emiten hoy",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
