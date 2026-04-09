"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { fetcher } from "@/utils";

interface NotificationItem {
  id: number;
  userId: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  providerName: string;
  providerIcon: string | null;
  type: string;
  read: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin}min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationBell() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const [showPanel, setShowPanel] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: notifications, mutate } = useSWR<NotificationItem[]>(
    isLoggedIn ? "/api/notifications" : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    mutate();
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <button
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        onClick={() => setShowPanel(!showPanel)}
        type="button"
        aria-label="Notificaciones"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel &&
        mounted &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setShowPanel(false)}
            />
            <div className="fixed right-4 top-16 z-[100] w-80 max-h-[70vh] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:right-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <button
                    className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors"
                    onClick={markAllRead}
                    type="button"
                  >
                    Marcar todo como leido
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[calc(70vh-52px)] overflow-y-auto">
                {(!notifications || notifications.length === 0) ? (
                  <div className="flex flex-col items-center justify-center px-4 py-8">
                    <svg
                      className="mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      No tienes notificaciones
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                        !n.read
                          ? "bg-emerald-50/50 dark:bg-emerald-950/10"
                          : ""
                      }`}
                      href={`/${n.mediaType}/${n.tmdbId}`}
                      key={n.id}
                      onClick={() => setShowPanel(false)}
                    >
                      {/* Poster thumbnail */}
                      <div className="flex-shrink-0">
                        <Image
                          alt={n.title}
                          className="rounded"
                          height={48}
                          src={
                            n.posterPath
                              ? `https://image.tmdb.org/t/p/w92${n.posterPath}`
                              : "https://placehold.co/32x48"
                          }
                          unoptimized
                          width={32}
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {n.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          {n.providerIcon && (
                            <Image
                              alt={n.providerName}
                              className="rounded-sm"
                              height={16}
                              src={n.providerIcon}
                              unoptimized
                              width={16}
                            />
                          )}
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            Disponible en {n.providerName}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
