import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Las películas más populares del momento",
  title: "Películas populares",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
