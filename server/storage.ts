import { users, workoutSessions, userPreferences, workoutProgress, type User, type UpsertUser, type WorkoutSession, type InsertWorkoutSession, type UserPreferences, type InsertUserPreferences, type WorkoutProgress, type InsertWorkoutProgress } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Workout session methods
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  getUserWorkoutSessions(userId?: string): Promise<WorkoutSession[]>;
  getWorkoutStats(userId?: string): Promise<{
    totalSessions: number;
    totalTime: number;
    thisWeek: number;
  }>;
  
  // User preferences methods
  getUserPreferences(userId?: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Workout progress methods for pause/resume functionality
  saveWorkoutProgress(progress: InsertWorkoutProgress): Promise<WorkoutProgress>;
  getWorkoutProgress(userId: string): Promise<WorkoutProgress | undefined>;
  deleteWorkoutProgress(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workout session methods
  async createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const [workoutSession] = await db
      .insert(workoutSessions)
      .values(session)
      .returning();
    return workoutSession;
  }

  async getUserWorkoutSessions(userId?: string): Promise<WorkoutSession[]> {
    if (!userId) return [];
    
    return await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .orderBy(desc(workoutSessions.completedAt));
  }

  async getWorkoutStats(userId?: string): Promise<{
    totalSessions: number;
    totalTime: number;
    thisWeek: number;
  }> {
    if (!userId) {
      return {
        totalSessions: 0,
        totalTime: 0,
        thisWeek: 0,
      };
    }

    const sessions = await this.getUserWorkoutSessions(userId);
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((acc, session) => acc + session.totalTime, 0);
    
    // Calculate sessions from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = sessions.filter(session => 
      session.completedAt && session.completedAt > oneWeekAgo
    ).length;

    return {
      totalSessions,
      totalTime,
      thisWeek,
    };
  }

  // User preferences methods
  async getUserPreferences(userId?: string): Promise<UserPreferences | undefined> {
    if (!userId) return undefined;
    
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [userPrefs] = await db
      .insert(userPreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: preferences,
      })
      .returning();
    return userPrefs;
  }

  // Workout progress methods for pause/resume functionality
  async saveWorkoutProgress(progress: InsertWorkoutProgress): Promise<WorkoutProgress> {
    const [savedProgress] = await db
      .insert(workoutProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: workoutProgress.userId,
        set: {
          ...progress,
          updatedAt: new Date(),
        },
      })
      .returning();
    return savedProgress;
  }

  async getWorkoutProgress(userId: string): Promise<WorkoutProgress | undefined> {
    const [progress] = await db
      .select()
      .from(workoutProgress)
      .where(eq(workoutProgress.userId, userId));
    return progress;
  }

  async deleteWorkoutProgress(userId: string): Promise<void> {
    await db
      .delete(workoutProgress)
      .where(eq(workoutProgress.userId, userId));
  }
}

export const storage = new DatabaseStorage();