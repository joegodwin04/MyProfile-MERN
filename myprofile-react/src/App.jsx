
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/projects";
const AUTH_API = "http://localhost:5000/api/auth";
const CONTACT_API = "http://localhost:5000/api/contact";

const EMPTY_FORM = {
  title: "",
  description: "",
  technology: "",
  url: "",
  githubUrl: "",
  imageUrl: "",
};

// Home page
function Home() {
  return (
    <section className="hero">
      <span className="eyebrow">WELCOME TO MYPROFILE</span>
      <h1>Build. Learn. Create.</h1>
      <p>
        Explore my profile, discover my projects, and get in touch with me.
      </p>
      <Link to="/projects" className="primary-btn">
        Explore Projects →
      </Link>
    </section>
  );
}

// About page
function About() {
  return (
    <section className="content-card">
      <span className="eyebrow">GET TO KNOW ME</span>
      <h1>About Me</h1>
      <p>
        I'm Joe Godwin, an Information Technology student interested in
        software development and modern web technologies.
      </p>

      <h2>My Interests</h2>
      <div className="skill-list">
        {["HTML", "CSS", "JavaScript", "React"].map((skill) => (
          <span className="skill" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

// Skills page
function Skills() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Git",
    "REST APIs",
  ];

  return (
    <section className="content-section">
      <span className="eyebrow">WHAT I WORK WITH</span>
      <h1>My Skills</h1>
      <p>
        Technologies and tools I am learning and using to build web
        applications.
      </p>

      <div className="skill-list">
        {skills.map((skill) => (
          <span className="skill" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

// Admin login page
function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("The server did not return an authentication token.");
      }

      onLogin(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      setError(
        err.message || "Unable to log in. Check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="content-card">
      <span className="eyebrow">ADMINISTRATION</span>
      <h1>Admin Login</h1>
      <p>Sign in to manage your MyProfile projects.</p>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="admin-email">Email Address</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          placeholder="Enter your admin email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login →"}
        </button>
      </form>

      <p>
        <Link to="/">← Back to Home</Link>
      </p>
    </section>
  );
}

// Project card
function ProjectCard({ project, isAdmin, onEdit, onDelete }) {
  return (
    <article className="project-card">
      {project.imageUrl ? (
        <img
          className="project-image"
          src={project.imageUrl}
          alt={`${project.title} project preview`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="project-icon">{"</>"}</div>
      )}

      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <span className="project-tech">
        {project.technology || "Technology not specified"}
      </span>

      <div className="project-links">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            View Project ↗
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            GitHub Repository ↗
          </a>
        )}
      </div>

      {isAdmin && (
        <div className="project-actions">
          <button type="button" onClick={() => onEdit(project)}>
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(project._id, project.title)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

// Projects and admin project management
function Projects({ token, isAdmin, dashboard = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  async function loadProjects() {
    try {
      setError("");

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to load projects.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an invalid project list.");
      }

      setProjects(data);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(project) {
    setForm({
      title: project.title || "",
      description: project.description || "",
      technology: project.technology || "",
      url: project.url || "",
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl || "",
    });

    setEditingId(project._id);
    setShowForm(true);
    setMessage("");
    setError("");

    window.setTimeout(() => {
      document
        .getElementById("project-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token || !isAdmin) {
      setError("Please log in as an administrator.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to save project."
        );
      }

      setMessage(
        editingId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      resetForm();
      setLoading(true);
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, title) {
    if (!token || !isAdmin) {
      setError("Please log in as an administrator.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to delete project."
        );
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage("Project deleted successfully!");
      setLoading(true);
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to delete project.");
    }
  }

  return (
    <section className="content-section">
      <span className="eyebrow">
        {dashboard ? "ADMINISTRATION" : "WHAT I'VE BUILT"}
      </span>

      <h1>{dashboard ? "Admin Dashboard" : "My Projects"}</h1>

      <p>
        {dashboard
          ? "Manage your portfolio projects from one place."
          : "Explore my work, technologies, and personal projects."}
      </p>

      {dashboard && (
        <p>
          <Link to="/projects">View public projects →</Link>
        </p>
      )}

      {message && <p role="status">{message}</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {loading && <p>Loading projects...</p>}

      {!loading && !error && projects.length === 0 && (
        <p>No projects found.</p>
      )}

      <div className="project-grid">
        {!loading &&
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isAdmin={isAdmin}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {isAdmin && (
        <div className="content-card" id="project-form">
          <h2>{editingId ? "Edit Project" : "Manage Your Projects"}</h2>
          <p>
            {editingId
              ? "Update the details of your selected project."
              : "Add a new project to your portfolio."}
          </p>

          {!showForm && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setForm({ ...EMPTY_FORM });
                setEditingId(null);
                setError("");
                setMessage("");
                setShowForm(true);
              }}
            >
              + Add New Project
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="project-title">Project Title</label>
              <input
                id="project-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
              />

              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project"
                rows={4}
                required
              />

              <label htmlFor="project-technology">Technology</label>
              <input
                id="project-technology"
                name="technology"
                value={form.technology}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                required
              />

              <label htmlFor="project-url">Live Project URL (optional)</label>
              <input
                id="project-url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              <label htmlFor="project-github">
                GitHub Repository URL (optional)
              </label>
              <input
                id="project-github"
                name="githubUrl"
                type="url"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repository"
              />

              <label htmlFor="project-image">
                Project Image URL (optional)
              </label>
              <input
                id="project-image"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/project-image.png"
              />

              {form.imageUrl && (
                <div className="image-preview">
                  <p>Image Preview</p>
                  <img
                    src={form.imageUrl}
                    alt="Project preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Project"
                    : "Add Project"}
              </button>

              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {!isAdmin && (
        <p>
          Want to manage projects? <Link to="/admin/login">Admin Login</Link>
        </p>
      )}
    </section>
  );
}

// Functional Contact form
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your message.");
      }

      setSuccess(data.message || "Your message was submitted successfully!");
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit your message. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="content-card contact-card">
      <span className="eyebrow">LET'S CONNECT</span>
      <h1>Contact Me</h1>
      <p>Have a question? Send me a message below.</p>

      {success && <p role="status">{success}</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Your Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          maxLength={100}
          required
        />

        <label htmlFor="contact-email">Your Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          maxLength={254}
          required
        />

        <label htmlFor="contact-message">Your Message</label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message here..."
          rows={5}
          maxLength={5000}
          required
        />

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message →"}
        </button>
      </form>
    </section>
  );
}

// Main application
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState(
    () => sessionStorage.getItem("myprofile_token") || ""
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("myprofile_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const isAdmin = Boolean(token && user?.role === "admin");

  function handleLogin(newToken, userData) {
    sessionStorage.setItem("myprofile_token", newToken);
    sessionStorage.setItem("myprofile_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }

  function handleLogout() {
    sessionStorage.removeItem("myprofile_token");
    sessionStorage.removeItem("myprofile_user");
    setToken("");
    setUser(null);
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">J</span>
          MyProfile<span className="brand-dot">.</span>
        </Link>

        <nav>
          <Link
            className={location.pathname === "/" ? "active" : ""}
            to="/"
          >
            Home
          </Link>

          <Link
            className={location.pathname === "/about" ? "active" : ""}
            to="/about"
          >
            About
          </Link>

          <Link
            className={location.pathname === "/skills" ? "active" : ""}
            to="/skills"
          >
            Skills
          </Link>

          <Link
            className={
              ["/projects", "/admin"].includes(location.pathname)
                ? "active"
                : ""
            }
            to="/projects"
          >
            Projects
          </Link>

          <Link
            className={`nav-contact ${
              location.pathname === "/contact" ? "active" : ""
            }`}
            to="/contact"
          >
            Contact
          </Link>

          {isAdmin ? (
            <>
              <Link
                className={location.pathname === "/admin" ? "active" : ""}
                to="/admin"
              >
                Dashboard
              </Link>

              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link
              className={
                location.pathname === "/admin/login" ? "active" : ""
              }
              to="/admin/login"
            >
              Admin Login
            </Link>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />

          <Route
            path="/projects"
            element={<Projects token={token} isAdmin={isAdmin} />}
          />

          <Route path="/contact" element={<Contact />} />

          <Route
            path="/admin/login"
            element={
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/admin"
            element={
              isAdmin ? (
                <Projects
                  token={token}
                  isAdmin={isAdmin}
                  dashboard
                />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer>
        <span>MyProfile</span> · Built with React
      </footer>
    </div>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
