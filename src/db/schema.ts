import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Re-export Better Auth tables
export { user, session, account, verification } from "./auth-schema";

// Custom app tables

export const watchlistItem = sqliteTable("watchlist_item", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path").notNull(),
  addedAt: integer("added_at", { mode: "timestamp_ms" }).notNull(),
});

export const userPreference = sqliteTable("user_preference", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique(),
  country: text("country").notNull(),
  platforms: text("platforms").notNull(), // JSON array: "[1,2,3]"
});

export const alert = sqliteTable("alert", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const notification = sqliteTable("notification", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path").notNull(),
  providerName: text("provider_name").notNull(),
  providerIcon: text("provider_icon"),
  type: text("type", { enum: ["available", "price_drop"] }).notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
