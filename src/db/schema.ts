import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Re-export Better Auth tables
export { account, session, user, verification } from "./auth-schema";

// Custom app tables

export const watchlistItem = sqliteTable("watchlist_item", {
  addedAt: integer("added_at", { mode: "timestamp_ms" }).notNull(),
  id: integer("id").primaryKey({ autoIncrement: true }),
  mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
  posterPath: text("poster_path").notNull(),
  title: text("title").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  userId: text("user_id").notNull(),
});

export const userPreference = sqliteTable("user_preference", {
  country: text("country").notNull(),
  id: integer("id").primaryKey({ autoIncrement: true }),
  platforms: text("platforms").notNull(), // JSON array: "[1,2,3]"
  userId: text("user_id").notNull().unique(),
});

export const alert = sqliteTable("alert", {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  id: integer("id").primaryKey({ autoIncrement: true }),
  mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
  posterPath: text("poster_path").notNull(),
  title: text("title").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  userId: text("user_id").notNull(),
});

export const notification = sqliteTable("notification", {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  id: integer("id").primaryKey({ autoIncrement: true }),
  mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
  posterPath: text("poster_path").notNull(),
  providerIcon: text("provider_icon"),
  providerName: text("provider_name").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  title: text("title").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  type: text("type", { enum: ["available", "price_drop"] }).notNull(),
  userId: text("user_id").notNull(),
});
