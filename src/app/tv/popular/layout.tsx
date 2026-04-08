import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Series populares",
  description: "Las series de televisión más populares del momento",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
