import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  workoutId: text("workout_id").notNull(),
  workoutTitle: text("workout_title").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  totalTime: integer("total_time").notNull(), // in seconds
  exercisesCompleted: integer("exercises_completed").notNull(),
  roundsCompleted: integer("rounds_completed").notNull(),
  caloriesEstimate: integer("calories_estimate").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  soundEnabled: boolean("sound_enabled").default(true).notNull(),
  difficultyLevel: varchar("difficulty_level").default('beginner').notNull(),
  preferredWorkouts: text("preferred_workouts").array(),
});

export const workoutProgress = pgTable("workout_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  workoutId: varchar("workout_id").notNull(),
  currentRound: integer("current_round").default(1),
  currentExerciseIndex: integer("current_exercise_index").default(0),
  exercisesCompleted: integer("exercises_completed").default(0),
  sessionState: varchar("session_state").default("ready"),
  startTime: bigint("start_time", { mode: "number" }).notNull(),
  timeRemaining: integer("time_remaining").default(0),
  isPaused: boolean("is_paused").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workoutSessions: many(workoutSessions),
  preferences: many(userPreferences),
  workoutProgress: many(workoutProgress),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const workoutProgressRelations = relations(workoutProgress, ({ one }) => ({
  user: one(users, {
    fields: [workoutProgress.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
  completedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export const insertWorkoutProgressSchema = createInsertSchema(workoutProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  startTime: z.number(),
});

// Types for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type WorkoutProgress = typeof workoutProgress.$inferSelect;
export type InsertWorkoutProgress = z.infer<typeof insertWorkoutProgressSchema>;
