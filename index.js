// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, serial, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("image"),
  image: text("image").notNull(),
  videoUrl: text("video_url"),
  description: text("description").notNull(),
  height: varchar("height", { length: 20 }).notNull().default("h-64"),
  featured: boolean("featured").notNull().default(false),
  tags: text("tags").array()
});
var insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, or, ilike } from "drizzle-orm";
var sql = neon(process.env.DATABASE_URL);
var db = drizzle(sql);
var DatabaseStorage = class {
  constructor() {
    this.initializeDatabase();
  }
  async initializeDatabase() {
    try {
      const existingItems = await db.select().from(galleryItems).limit(1);
      if (existingItems.length === 0) {
        const initialItems = [
          // Photography Images (25 items)
          {
            title: "Urban Landscape",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            description: "Capturing the essence of modern city life through dramatic architectural perspectives and urban lighting",
            height: "h-64",
            featured: true,
            tags: ["urban", "architecture", "cityscape"]
          },
          {
            title: "Portrait Series",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
            description: "Intimate portraits exploring human emotion and expression through careful composition and lighting",
            height: "h-80",
            featured: false,
            tags: ["portrait", "emotion", "studio"]
          },
          {
            title: "Nature's Symphony",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
            description: "Breathtaking landscapes showcasing the raw beauty and power of the natural world",
            height: "h-56",
            featured: true,
            tags: ["nature", "landscape", "outdoor"]
          },
          {
            title: "Street Photography",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=650",
            description: "Candid moments of urban life captured through spontaneous street photography",
            height: "h-72",
            featured: false,
            tags: ["street", "candid", "urban"]
          },
          {
            title: "Architectural Details",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            description: "Exploring geometric patterns and textures in contemporary architecture",
            height: "h-64",
            featured: false,
            tags: ["architecture", "geometry", "modern"]
          },
          {
            title: "Cultural Heritage",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
            description: "Documenting traditional crafts and cultural practices around the world",
            height: "h-84",
            featured: true,
            tags: ["culture", "tradition", "heritage"]
          },
          {
            title: "Abstract Compositions",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
            description: "Experimental photography exploring color, form, and abstract visual concepts",
            height: "h-56",
            featured: false,
            tags: ["abstract", "experimental", "color"]
          },
          {
            title: "Wildlife Photography",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
            description: "Intimate glimpses into the world of wildlife and animal behavior",
            height: "h-80",
            featured: true,
            tags: ["wildlife", "animals", "nature"]
          },
          {
            title: "Macro Photography",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            description: "Discovering the intricate details of the microscopic world around us",
            height: "h-64",
            featured: false,
            tags: ["macro", "detail", "close-up"]
          },
          {
            title: "Night Photography",
            category: "photography",
            type: "image",
            image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
            description: "Capturing the magic and mystery of the nocturnal world",
            height: "h-80",
            featured: true,
            tags: ["night", "low-light", "atmospheric"]
          },
          // Art Images (15 items)
          {
            title: "Contemporary Sculpture",
            category: "art",
            type: "image",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            description: "Modern sculptural works exploring form, space, and material innovation",
            height: "h-64",
            featured: true,
            tags: ["sculpture", "modern", "3d"]
          },
          {
            title: "Digital Paintings",
            category: "art",
            type: "image",
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=650",
            description: "Digital art pieces blending traditional painting techniques with modern technology",
            height: "h-72",
            featured: false,
            tags: ["digital", "painting", "technology"]
          },
          {
            title: "Mixed Media Art",
            category: "art",
            type: "image",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=550",
            description: "Experimental artworks combining various materials and artistic mediums",
            height: "h-60",
            featured: false,
            tags: ["mixed-media", "experimental", "collage"]
          },
          {
            title: "Installation Art",
            category: "art",
            type: "image",
            image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
            description: "Large-scale installations creating immersive artistic experiences",
            height: "h-80",
            featured: true,
            tags: ["installation", "immersive", "large-scale"]
          },
          {
            title: "Abstract Expressionism",
            category: "art",
            type: "image",
            image: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            description: "Bold abstract works expressing emotion through color and gestural brushwork",
            height: "h-64",
            featured: false,
            tags: ["abstract", "expressionism", "color"]
          },
          // Design Images (10 items)
          {
            title: "Minimalist Design",
            category: "design",
            type: "image",
            image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
            description: "Clean, minimalist design solutions emphasizing simplicity and functionality",
            height: "h-56",
            featured: true,
            tags: ["minimalist", "clean", "functional"]
          },
          {
            title: "Typography Art",
            category: "design",
            type: "image",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=650",
            description: "Creative typography designs exploring letterforms as artistic expression",
            height: "h-72",
            featured: false,
            tags: ["typography", "lettering", "graphic"]
          },
          {
            title: "Brand Identity",
            category: "design",
            type: "image",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            description: "Comprehensive brand identity systems for contemporary businesses",
            height: "h-64",
            featured: false,
            tags: ["branding", "identity", "logo"]
          },
          {
            title: "UI/UX Design",
            category: "design",
            type: "image",
            image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
            description: "Modern user interface and experience design for digital applications",
            height: "h-80",
            featured: true,
            tags: ["ui", "ux", "digital"]
          },
          // Video Content (30 items)
          {
            title: "Cinematic Short Film",
            category: "video",
            type: "video",
            image: "https://images.unsplash.com/photo-1489599063916-f4e4b71c2f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            description: "A captivating short film exploring themes of solitude and urban life",
            height: "h-64",
            featured: true,
            tags: ["film", "cinematic", "narrative"]
          },
          {
            title: "Motion Graphics Demo",
            category: "video",
            type: "video",
            image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
            description: "Dynamic motion graphics showcasing brand identity and visual storytelling",
            height: "h-80",
            featured: false,
            tags: ["motion", "graphics", "animation"]
          },
          {
            title: "Documentary Excerpt",
            category: "video",
            type: "video",
            image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            description: "Documentary piece examining contemporary art movements and their impact",
            height: "h-56",
            featured: true,
            tags: ["documentary", "art", "culture"]
          },
          {
            title: "Time-lapse Photography",
            category: "video",
            type: "video",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=650",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4",
            description: "Mesmerizing time-lapse sequences capturing the rhythm of city life",
            height: "h-72",
            featured: false,
            tags: ["timelapse", "city", "rhythm"]
          },
          {
            title: "3D Animation Showcase",
            category: "video",
            type: "video",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            description: "Cutting-edge 3D animation demonstrating technical artistry and creativity",
            height: "h-64",
            featured: true,
            tags: ["3d", "animation", "technical"]
          }
        ];
        for (let i = 20; i < 50; i++) {
          initialItems.push({
            title: `Gallery Item ${i + 1}`,
            category: i % 3 === 0 ? "photography" : i % 3 === 1 ? "art" : "design",
            type: "image",
            image: `https://picsum.photos/500/600?random=${i}`,
            description: `Professional artwork showcasing creative excellence and artistic vision - Item ${i + 1}`,
            height: ["h-56", "h-64", "h-72", "h-80"][i % 4],
            featured: i % 5 === 0,
            tags: ["creative", "professional", "artistic"]
          });
        }
        for (let i = 50; i < 80; i++) {
          initialItems.push({
            title: `Video Content ${i - 49}`,
            category: "video",
            type: "video",
            image: `https://picsum.photos/500/600?random=${i + 100}`,
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
            description: `Professional video content showcasing cinematic excellence - Video ${i - 49}`,
            height: ["h-56", "h-64", "h-72", "h-80"][i % 4],
            featured: i % 7 === 0,
            tags: ["video", "cinematic", "professional"]
          });
        }
        await db.insert(galleryItems).values(initialItems);
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  async getAllGalleryItems() {
    return await db.select().from(galleryItems);
  }
  async getGalleryItemsByCategory(category) {
    return await db.select().from(galleryItems).where(eq(galleryItems.category, category));
  }
  async getGalleryItemsByType(type) {
    return await db.select().from(galleryItems).where(eq(galleryItems.type, type));
  }
  async getFeaturedItems() {
    return await db.select().from(galleryItems).where(eq(galleryItems.featured, true));
  }
  async searchGalleryItems(query) {
    return await db.select().from(galleryItems).where(
      or(
        ilike(galleryItems.title, `%${query}%`),
        ilike(galleryItems.description, `%${query}%`),
        ilike(galleryItems.category, `%${query}%`)
      )
    );
  }
  async createGalleryItem(insertItem) {
    const result = await db.insert(galleryItems).values(insertItem).returning();
    return result[0];
  }
  async updateGalleryItem(id, updateData) {
    const result = await db.update(galleryItems).set(updateData).where(eq(galleryItems.id, id)).returning();
    return result[0];
  }
  async deleteGalleryItem(id) {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }
  async getGalleryItem(id) {
    const result = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return result[0];
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/gallery", async (req, res) => {
    try {
      const { category, search, type, featured } = req.query;
      let items;
      if (search) {
        items = await storage.searchGalleryItems(search);
      } else if (featured === "true") {
        items = await storage.getFeaturedItems();
      } else if (type && type !== "all") {
        items = await storage.getGalleryItemsByType(type);
      } else if (category && category !== "all") {
        items = await storage.getGalleryItemsByCategory(category);
      } else {
        items = await storage.getAllGalleryItems();
      }
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });
  app2.get("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getGalleryItem(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery item" });
    }
  });
  app2.get("/api/gallery/categories", async (req, res) => {
    try {
      const items = await storage.getAllGalleryItems();
      const categories = Array.from(new Set(items.map((item) => item.category)));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/admin/gallery", async (req, res) => {
    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const newItem = await storage.createGalleryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to create gallery item", error });
    }
  });
  app2.put("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGalleryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateGalleryItem(id, validatedData);
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update gallery item", error });
    }
  });
  app2.delete("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
