
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Project = require("./models/Project");
const Contact = require("./models/Contact");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Connect to local MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/myprofile")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// GET: Retrieve all projects (public)
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a project (admin only)
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      technology,
      url,
      githubUrl,
      imageUrl,
    } = req.body;

    const project = new Project({
      title,
      description,
      technology,
      url,
      githubUrl,
      imageUrl,
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a project (admin only)
app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "technology",
      "url",
      "githubUrl",
      "imageUrl",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove a project (admin only)
app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST: Save a contact message (public)
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        message: "Name must be 100 characters or fewer.",
      });
    }

    if (email.trim().length > 254) {
      return res.status(400).json({
        message: "Email address is too long.",
      });
    }

    if (message.trim().length > 5000) {
      return res.status(400).json({
        message: "Message must be 5000 characters or fewer.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(201).json({
      message: "Your message was submitted successfully.",
      id: contact._id,
    });
  } catch (error) {
    console.error("Contact submission error:", error.message);
    res.status(500).json({
      message: "Unable to save your message. Please try again later.",
    });
  }
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
