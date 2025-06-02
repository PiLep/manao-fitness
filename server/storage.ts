import { users, workoutSessions, userPreferences, type User, type InsertUser, type WorkoutSession, type InsertWorkoutSession, type UserPreferences, type InsertUserPreferences } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workout session methods
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  getUserWorkoutSessions(userId?: number): Promise<WorkoutSession[]>;
  getWorkoutStats(userId?: number): Promise<{
    totalSessions: number;
    totalTime: number;
    thisWeek: number;
  }>;
  
  // User preferences methods
  getUserPreferences(userId?: number): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const [workoutSession] = await db
      .insert(workoutSessions)
      .values(session)
      .returning();
    return workoutSession;
  }

  async getUserWorkoutSessions(userId?: number): Promise<WorkoutSession[]> {
    if (userId) {
      return await db.select().from(workoutSessions)
        .where(eq(workoutSessions.userId, userId))
        .orderBy(desc(workoutSessions.completedAt));
    }
    return await db.select().from(workoutSessions)
      .orderBy(desc(workoutSessions.completedAt));
  }

  async getWorkoutStats(userId?: number): Promise<{
    totalSessions: number;
    totalTime: number;
    thisWeek: number;
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let allSessions: WorkoutSession[];
    if (userId) {
      allSessions = await db.select().from(workoutSessions)
        .where(eq(workoutSessions.userId, userId));
    } else {
      allSessions = await db.select().from(workoutSessions);
    }

    const thisWeekSessions = allSessions.filter(
      session => new Date(session.completedAt) >= oneWeekAgo
    );

    return {
      totalSessions: allSessions.length,
      totalTime: allSessions.reduce((sum, session) => sum + session.totalTime, 0),
      thisWeek: thisWeekSessions.length,
    };
  }

  async getUserPreferences(userId?: number): Promise<UserPreferences | undefined> {
    if (!userId) return undefined;
    
    const [preferences] = await db.select().from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    if (!preferences.userId) {
      throw new Error("User ID is required for preferences");
    }

    const existing = await this.getUserPreferences(preferences.userId);
    
    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set(preferences)
        .where(eq(userPreferences.userId, preferences.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
