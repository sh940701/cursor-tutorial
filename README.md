# Todo App (React + Node.js)

This is a full-stack Todo application built with a React frontend and a Node.js (Express) backend.

## Features

- Create, Read, Update, Delete (CRUD) operations for todos.
- In-memory data storage on the backend (no database required).
- Modern UI with Tailwind CSS.
- TypeScript support on both frontend and backend.
- Water-ripple effect on the background.
- Dark mode, language toggle (KO/EN), and advanced filtering/sorting.

## Project Structure

The project is organized into two main parts:

-   `frontend/`: Contains the React application (create-react-app).
-   `backend/`: Contains the Node.js/Express server.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later recommended)
-   [npm](https://www.npmjs.com/)

### Running the Application

To start both the frontend and backend servers concurrently, run the following command from the project root directory:

```bash
npm start
```

This will:
1.  Install/update dependencies in both `frontend` and `backend` folders.
2.  Start the backend server on `http://localhost:3001`.
3.  Start the frontend development server on `http://localhost:3000`.

The application will automatically open in your default browser.

## API Endpoints

- `GET /api/todos` - Retrieve all todos
- `POST /api/todos` - Add a new todo
- `PUT /api/todos/:id` - Update an existing todo
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos/completed` - Delete all completed todos
- `DELETE /api/todos` - Delete all todos
- `GET /api/stats` - Retrieve statistics information

## Technology Stack

### Frontend
- React 18
- Axios (HTTP client)
- CSS3

### Backend
- Node.js
- Express.js
- CORS
- Body-parser

## Data Storage

Currently, an In-memory storage is used, which means data will be reset when the server restarts. For a real production environment, a database connection is required. 