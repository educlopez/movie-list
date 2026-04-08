import "@/styles/tailwind.css";

import { AppShell } from "./AppShell";

const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`;

export const metadata = {
  title: { default: "Movielist", template: "%s - Movielist" },
  description:
    "Descubre, explora y guarda tus películas y series favoritas. Información actualizada de estrenos, tendencias y plataformas de streaming.",
  robots: "all",
  openGraph: {
    title: {
      default: "Movielist",
      template: "%s - Movielist",
    },
    description:
      "Descubre, explora y guarda tus películas y series favoritas. Información actualizada de estrenos, tendencias y plataformas de streaming.",
    siteName: "Movielist",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Movielist",
      template: "%s - Movielist",
    },
    description:
      "Descubre, explora y guarda tus películas y series favoritas.",
  },
  alternates: {
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`,
      "application/feed+json": `${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.json`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full antialiased" lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body className="flex h-full flex-col bg-white antialiased dark:bg-black">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
