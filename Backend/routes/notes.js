
const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET: Fetch all notes or search notes
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: escapeRegex(q), $options: "i" } },
            { content: { $regex: escapeRegex(q), $options: "i" } },
          ],
        }
      : {};

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes." });
  }
});

// POST: Create a note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof content !== "string" || !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note." });
  }
});

// PUT: Update a note
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    const { title, content } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof content !== "string" || !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), content: content.trim() },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note." });
  }
});

// DELETE: Delete a note
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note." });
  }
});

module.exports = router;
