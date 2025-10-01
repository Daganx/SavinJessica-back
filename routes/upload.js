import upload from "../middleware/upload.js";

// POST /api/projects/upload -> upload image
router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  res.json({ url: req.file.path }); // Cloudinary retourne l'URL publique
});
