# NotesSpace — MERN Notes Application

NotesSpace is a full-stack notes application built using the MERN stack. It allows users to create, view, edit, delete, and search notes through a responsive user interface.

## Features

- Create new notes
- View saved notes
- Edit existing notes
- Delete notes
- Search notes by title or content
- Store notes in MongoDB
- Responsive user interface
- REST API built with Express and Node.js

## Technologies Used

**Frontend**
- React
- Vite
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
Notes_application/
├── Backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB server
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/sayantikadas06/NotesSpace.git
cd NotesSpace
```

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder with your own configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Replace `your_mongodb_connection_string` with your own MongoDB connection string. Never publish your real credentials.

### 3. Start the backend

From the `Backend` folder, run:

```bash
npm run dev
```

If your `package.json` does not define a `dev` script, use the script that is available in your backend `package.json`.

### 4. Configure and start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | Retrieve notes and search |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Database

MongoDB stores the notes. The backend uses a Mongoose model to define the note structure.

## Future Improvements

- User authentication
- Categories and tags
- Note pinning
- Deployment to a hosting platform

## Author

**Sayantika Das**

GitHub: [@sayantikadas06](https://github.com/sayantikadas06)

---

Developed as a full-stack development project.
