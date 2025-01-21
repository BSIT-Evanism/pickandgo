import { relations, sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, boolean, pgEnum, json, uuid, serial, check } from "drizzle-orm/pg-core";


export const userRole = pgEnum("user_role", ["admin", "user"]);
export const servicesProductType = pgEnum("services_product_type", ["service", "product"]);
export const promotionTier = pgEnum("promotion_tier", ["bronze", "silver", "gold"]);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    role: text('role', { enum: userRole.enumValues }).notNull().default("user"),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    hasFeedback: boolean('has_feedback').notNull().default(false)
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id)
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});


export const farmActivity = pgTable("farm_activity", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: json("description").array().$type<{
        id: string;
        type: "heading" | "paragraph" | "list" | "image" | "link";
        content: string;
    }[]>(),
    createdAt: timestamp("created_at").notNull(),
    active: boolean("active").notNull().default(false),
    updatedAt: timestamp("updated_at").notNull(),
    image: text("image")
});


export const servicesProduct = pgTable("services_product", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type", { enum: servicesProductType.enumValues }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull()
});


export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const promotions = pgTable("promotions", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    tier: text("tier", { enum: promotionTier.enumValues }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull()
});

export const feedback = pgTable("feedback", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").notNull(),
});


export type FarmActivity = typeof farmActivity.$inferSelect;
export type ServicesProduct = typeof servicesProduct.$inferSelect;
export type Events = typeof events.$inferSelect;
export type Promotions = typeof promotions.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;