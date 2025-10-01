// routes/projects.js
import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// POST /api/projects/upload -> upload image (Cloudinary via Multer)
router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }
    return res.json({ url: req.file.path });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/projects  -> lister tous les projets (public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id  -> récupérer un projet
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Projet non trouvé" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects  -> créer un projet (auth requis)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      images = [],
      customer,
      year,
      price,
      time,
      need,
      place,
    } = req.body;
    if (!title) return res.status(400).json({ error: "title requis" });

    const newProject = new Project({
      title,
      description,
      images,
      customer,
      year,
      price,
      time,
      need,
      place,
      createdBy: req.userId,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id -> modifier un projet (auth requis)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Projet non trouvé" });

    // Option : restreindre la modification au créateur
    // if (project.createdBy?.toString() !== req.userId) return res.status(403).json({ error: "Non autorisé" });

    const updates = req.body;
    Object.assign(project, updates);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id -> supprimer (auth requis)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Projet non trouvé" });

    // Option : restreindre la suppression au créateur
    // if (project.createdBy?.toString() !== req.userId) return res.status(403).json({ error: "Non autorisé" });

    await project.remove();
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
