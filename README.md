# MyProfile — MERN Portfolio Management System

A personal portfolio web application built with the MERN stack. It showcases projects, technical skills, profile information, and a contact form, with an admin dashboard for managing portfolio projects.

## Features

- **Home:** Personal portfolio landing page.
- **About:** Profile introduction.
- **Skills:** Technical skills showcase.
- **Projects:** Displays portfolio projects retrieved from the backend.
- **Contact:** Contact form for submitting messages.
- **Admin authentication:** Protected administrator login.
- **Project management:** Create, read, update, and delete portfolio projects.
- **Database integration:** MongoDB stores project information and contact messages.

## Technology Stack

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## Project Structure

```text
EXP 1-10/
├── myprofile-react/   # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/            # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/joegodwin04/MyProfile-MERN.git
cd MyProfile-MERN
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

Configure the backend environment variables in a local `.env` file according to the application's configuration. Never commit credentials or secret keys.

### 3. Start the backend

Run the start script defined in `server/package.json`.

### 4. Install frontend dependencies

Open a second terminal from the repository root:

```bash
cd myprofile-react
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Security

- Keep `.env` files and credentials out of version control.
- Use secure environment variables for production deployments.
- Configure production database access and authentication carefully.

## Deployment

Deployment is planned. Hosting providers, production configuration, and live URLs will be added after deployment is completed and tested.

## Author

Joe Godwin

## License

No license has been specified yet.
