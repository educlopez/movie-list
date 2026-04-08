import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Películas populares",
  description: "Las películas más populares del momento",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
