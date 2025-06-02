import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSessionSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Protected workout session routes
  app.post("/api/workout-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertWorkoutSessionSchema.parse({
        ...req.body,
        userId
      });
      const session = await storage.createWorkoutSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating workout session:", error);
      res.status(400).json({ error: "Invalid workout session data" });
    }
  });

  app.get("/api/workout-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserWorkoutSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching workout sessions:", error);
      res.status(500).json({ error: "Failed to fetch workout sessions" });
    }
  });

  app.get("/api/workout-stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getWorkoutStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching workout stats:", error);
      res.status(500).json({ error: "Failed to fetch workout stats" });
    }
  });

  // Protected user preferences routes
  app.get("/api/user-preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || { soundEnabled: true, preferredWorkouts: [] });
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/user-preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.createOrUpdateUserPreferences({
        ...req.body,
        userId
      });
      res.json(preferences);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(400).json({ error: "Failed to save user preferences" });
    }
  });

  // Workout progress routes for pause/resume functionality
  app.get('/api/workout-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getWorkoutProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching workout progress:", error);
      res.status(500).json({ error: "Failed to fetch workout progress" });
    }
  });

  app.post('/api/workout-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.saveWorkoutProgress({
        userId,
        ...req.body
      });
      res.json(progress);
    } catch (error) {
      console.error("Error saving workout progress:", error);
      res.status(400).json({ error: "Failed to save workout progress" });
    }
  });

  app.delete('/api/workout-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteWorkoutProgress(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workout progress:", error);
      res.status(400).json({ error: "Failed to delete workout progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
