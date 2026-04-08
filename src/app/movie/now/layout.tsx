import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "En cartelera",
  description: "Películas en cartelera actualmente en los cines",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
