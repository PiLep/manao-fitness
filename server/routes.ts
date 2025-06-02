import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Workout session routes
  app.post("/api/workout-sessions", async (req, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse(req.body);
      const session = await storage.createWorkoutSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating workout session:", error);
      res.status(400).json({ error: "Invalid workout session data" });
    }
  });

  app.get("/api/workout-sessions", async (req, res) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const sessions = await storage.getUserWorkoutSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching workout sessions:", error);
      res.status(500).json({ error: "Failed to fetch workout sessions" });
    }
  });

  app.get("/api/workout-stats", async (req, res) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const stats = await storage.getWorkoutStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching workout stats:", error);
      res.status(500).json({ error: "Failed to fetch workout stats" });
    }
  });

  // User preferences routes
  app.get("/api/user-preferences", async (req, res) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || { soundEnabled: true, preferredWorkouts: [] });
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/user-preferences", async (req, res) => {
    try {
      const preferences = await storage.createOrUpdateUserPreferences(req.body);
      res.json(preferences);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(400).json({ error: "Failed to save user preferences" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
