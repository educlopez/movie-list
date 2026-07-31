import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Películas en cartelera actualmente en los cines",
  title: "En cartelera",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
