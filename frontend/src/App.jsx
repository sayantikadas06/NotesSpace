
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, Pencil, Trash2, X, FileText } from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchNotes(query = "") {
    try {
      setError("");
      const response = await axios.get(API_URL, {
        params: query.trim() ? { q: query.trim() } : {},
      });
      setNotes(response.data);
    } catch {
      setError("Could not load notes. Check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  function openNewForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  }

  function openEditForm(note) {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and some content.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await axios.post(API_URL, {
          title: title.trim(),
          content: content.trim(),
        });
      }

      setShowForm(false);
      setTitle("");
      setContent("");
      setEditingId(null);
      await fetchNotes(search);
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Could not save the note. Please check your connection and try again."
    );
  } finally {
    setSaving(false);
  }
}

  async function deleteNote(id) {
    const confirmed = window.confirm("Delete this note permanently?");
    if (!confirmed) return;

    try {
      setError("");
      await axios.delete(`${API_URL}/${id}`);
      await fetchNotes(search);
    } catch {
      setError("Could not delete the note. Please try again.");
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon"><FileText size={22} /></span>
          <span>NoteSpace</span>
        </div>
        <button className="primary-btn" onClick={openNewForm}>
          <Plus size={18} /> New Note
        </button>
      </header>

      <main className="main-content">
        <section className="welcome">
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>Your thoughts, organized.</h1>
          <p className="subtitle">
            Capture ideas, keep track of things, and find them whenever you need.
          </p>
        </section>

        <div className="search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button className="icon-btn" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={18} />
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="section-heading">
          <h2>{search ? "Search results" : "All Notes"}</h2>
          <span>{notes.length} notes</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading notes...</p>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <FileText size={38} />
            <h3>{search ? "No matching notes" : "No notes yet"}</h3>
            <p>
              {search
                ? "Try another search term."
                : "Create your first note to get started."}
            </p>
            {!search && (
              <button className="primary-btn" onClick={openNewForm}>
                <Plus size={18} /> Create Note
              </button>
            )}
          </div>
        ) : (
          <section className="notes-grid">
            {notes.map((note) => (
              <article className="note-card" key={note._id}>
                <h3>{note.title}</h3>
                <p className="note-content">{note.content}</p>
                <div className="note-footer">
                  <span>
                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="note-actions">
                    <button className="icon-btn" onClick={() => openEditForm(note)} aria-label="Edit note">
                      <Pencil size={16} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => deleteNote(note._id)} aria-label="Delete note">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section className="note-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <h2>{editingId ? "Edit Note" : "Create a Note"}</h2>
              <button className="icon-btn" onClick={() => setShowForm(false)} aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your note a title"
                maxLength={150}
                required
              />

              <label htmlFor="note-content">Content</label>
              <textarea
                id="note-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write your thoughts here..."
                rows={7}
                maxLength={20000}
                required
              />

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Save Note"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
