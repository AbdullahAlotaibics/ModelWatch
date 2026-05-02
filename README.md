# Model Watch

Model Watch is a full-stack model management platform used to organize, review, update, and compare machine learning models. The application supports three main roles: administrators, model owners, and analysts. Each role has its own dashboard, permissions, and workflows.

The project started as a front-end prototype and now includes a Node.js/Express back-end with MongoDB database integration for users, categories, issues, and model records.

## Features

- Role-based login and protected navigation
- Admin workspace for user, category, issue, and model management
- Owner dashboard for creating, editing, viewing, and managing owned models
- Analyst dashboard for browsing accessible public and shared models
- Model CRUD operations using the back-end API
- Model visibility support:
  - Public
  - Shared
  - Private
- Analytical notes on model profiles
- Model history tracking
- Model comparison workflow
- Issue reporting and admin issue resolution
- Seed script for demo users, categories, and models
- API smoke test script for validating important backend functionality

## User Roles

### Admin

Admins manage the system. They can manage users, categories, issues, and models.

### Model Owner

Model owners create and maintain model profiles. They can update model details, attributes, notes, and visibility.

### Model Analyst / Data Scientist

Analysts review accessible models, add analytical notes, compare models, and flag models for review. Analysts can only access public and shared models.

## Tech Stack

### Front End

- React 19
- Vite
- React Router
- Plain CSS
- ESLint

### Back End

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

## Dependencies and Frameworks Used

### React

React is used to build the user interface as reusable components. Pages such as the admin workspace, owner dashboard, model details page, and analyst dashboard are implemented as React components.

### Vite

Vite is the development and build tool used for the front end. It provides fast local development, hot module replacement, and production builds.

### React Router

React Router is used for client-side routing. It handles login redirects, protected routes, and role-based page access.

### Node.js and Express.js

Node.js and Express.js are used to build the back-end server and REST API. The server handles authentication, user management, model management, issue management, category management, and database communication.

### MongoDB and Mongoose

MongoDB is used as the database. Mongoose is used to define schemas and interact with MongoDB.

### ESLint

ESLint is used to maintain code quality and catch common JavaScript and React issues.

### Plain CSS

The project uses regular CSS files for styling instead of a component library or CSS framework.

## Setup and Installation

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- MongoDB Atlas account or local MongoDB instance

## Front-End Setup

From the main project folder, install dependencies:

```bash
npm install
```

Start the front-end development server:

```bash
npm run dev
```

Vite will print the local development URL, usually:

```text
http://localhost:5173
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Back-End Setup

The back-end server is located in the `server/` folder.

Change into the server folder:

```bash
cd server
```

Install server dependencies:

```bash
npm install
```

Create the environment file:

```bash
copy .env.example .env
```

If `.env.example` is not available, create a `.env` file manually.

Example `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

## Database Seeding

The project includes a seed script for demo data.

Run this inside the `server/` folder:

```bash
npm run seed
```

The seed script creates demo accounts, categories, and sample models in MongoDB.

After seeding, start both the backend and frontend, then log in with the demo accounts to verify that seeded models appear in the app.

## API Smoke Tests

The backend includes a smoke test script for important API checks.

First, make sure the backend server is running in one terminal:

```bash
cd server
npm run dev
```

Then open a second terminal and run:

```bash
cd server
npm run test:smoke
```

The smoke test checks important model API functionality such as:

- Login
- Create model
- List models
- Get model details
- Update model
- Delete model

A successful result should show that all tests passed.

## API Documentation

Base URL:

```text
http://localhost:5000/api
```

Authenticated routes require a bearer token:

```text
Authorization: Bearer <token>
```

The token is returned from the login endpoint.

## Auth Endpoints

### Register User

```http
POST /api/auth/register
```

Creates a new user.

Example body:

```json
{
  "name": "John Owner",
  "email": "owner@example.com",
  "password": "password123",
  "role": "owner"
}
```

### Login

```http
POST /api/auth/login
```

Authenticates a user and returns a token.

Example body:

```json
{
  "email": "owner@modelwatch.com",
  "password": "owner123"
}
```

## User Endpoints

Admin only.

```http
GET /api/users
POST /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

These routes allow the admin to list, create, view, update, and delete users.

## Category Endpoints

```http
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

Category modification routes are admin only.

## Model Endpoints

### List Models

```http
GET /api/models
```

Lists models visible to the current user.

Supported query parameters:

```text
search
category
visibility
owner
ownerEmail
sort
```

Example:

```http
GET /api/models?search=model&category=Machine%20Learning&visibility=public&sort=updated
```

Visibility rules:

- Owners can see their own public, shared, and private models.
- Analysts can see public and shared models.
- Analysts cannot see private models.
- Admins can access model management functionality.

### Create Model

```http
POST /api/models
```

Allowed for admins and owners.

Example body:

```json
{
  "name": "Sentiment Classifier",
  "description": "A model for classifying text sentiment.",
  "category": "Machine Learning",
  "visibility": "public",
  "attributes": [
    {
      "name": "Accuracy",
      "value": "92%"
    }
  ]
}
```

### Get Model Details

```http
GET /api/models/:id
```

Returns model details if the model is visible to the current user.

### Update Model

```http
PUT /api/models/:id
```

Allowed for admins or the model owner.

Can update:

- name
- description
- category
- visibility
- attributes

### Delete Model

```http
DELETE /api/models/:id
```

Allowed for admins or the model owner.

### Add Analytical Note

```http
POST /api/models/:id/notes
```

Adds an analytical note to a visible model.

Example body:

```json
{
  "text": "This model performs better on small datasets."
}
```

### Model History

```http
GET /api/models/:id/history
```

Returns the model update history.

## Issue Endpoints

```http
GET /api/issues
POST /api/issues
GET /api/issues/:id
PUT /api/issues/:id
DELETE /api/issues/:id
```

Issue behavior:

- Authenticated users can report issues.
- Admins can view, update, resolve, and delete issues.
- Flagged models are sent to the admin issue management page.

## Demo Accounts

Use these accounts after running the seed script.

```text
Admin User:
admin@modelwatch.com / admin123

John Owner:
owner@modelwatch.com / owner123

Sarah Analyst:
analyst@modelwatch.com / analyst123
```

## Usage

### General Flow

1. Start the backend server.
2. Start the frontend server.
3. Open the Vite local URL in the browser.
4. Log in with one of the demo accounts.
5. The app redirects based on the user role.

### Admin Usage

When signed in as an admin:

1. Use the navigation bar to access Dashboard, Users, Categories, Issues, and Models.
2. Open Users to add, edit, search, or delete users.
3. Open Categories to add, edit, or delete model categories.
4. Open Issues to review and resolve reported issues.
5. Open Models to manage model records from the admin side.

### Owner Usage

When signed in as a model owner:

1. The owner dashboard displays models owned by that account.
2. Owners can create new models.
3. Owners can edit model details.
4. Owners can change visibility between public, shared, and private.
5. Owners can add or remove attributes.
6. Owners can open model details and view history.
7. Owners can add analytical notes.
8. Owners can compare their models.
9. Changes should persist after browser refresh because model data is stored in MongoDB.

### Analyst Usage

When signed in as an analyst:

1. The analyst dashboard displays only public and shared models.
2. Private models are hidden from analysts.
3. Analysts can search and filter accessible models.
4. Analysts can open model details.
5. Analysts can add analytical notes.
6. Analysts can compare accessible models.
7. Analysts can flag models for admin review.
8. Analysts can export model summaries if the export option is available.

## Manual Test Checklist

Use this checklist before submission.

### Frontend

```bash
npm run lint
npm run build
```

Expected result:

- Lint finishes without errors.
- Production build completes successfully.

### Backend

Run the backend:

```bash
cd server
npm run dev
```

Run smoke tests in another terminal:

```bash
cd server
npm run test:smoke
```

Expected result:

```text
All tests passed
```

### Seed Check

```bash
cd server
npm run seed
```

Then verify:

- Demo users can log in.
- Seeded models appear in the UI.
- Seeded models remain after browser refresh.

### Owner Model Flow

Verify:

- Owner can create a model.
- Owner can edit a model.
- Owner can change visibility.
- Owner can add and remove attributes.
- Owner can open model details.
- Owner can add analytical notes.
- Data persists after browser refresh.

### Visibility Rules

Verify:

- Owner can see their own public, shared, and private models.
- Analyst can see public models.
- Analyst can see shared models.
- Analyst cannot see private models.

### Admin Flow

Verify:

- Admin can manage users.
- Admin can manage categories.
- Admin can manage issues.
- Admin can manage models if the admin model page is included.

## Project Structure

```text
ModelWatch/
  src/
    Page/             Main page components and page-level styles
    App.jsx           Top-level routing and login flow
    main.jsx          React entry point
    index.css         Global styles

  server/
    models/           Mongoose schemas
    routes/           Express routes
    middleware/       Authentication and authorization middleware
    seed.js           Demo data seed script
    smoke-test.js     API smoke test script
    server.js         Express server entry point

  public/             Static assets
  package.json        Front-end package file
  README.md           Project documentation
```

## Environment Variables

The backend uses environment variables for sensitive configuration.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

Do not commit real database credentials or secrets to GitHub.

## Deployment Notes for Phase 6

For deployment, the project should be configured with:

- Hosted frontend, such as Vercel or Netlify
- Hosted backend, such as Render, Railway, Heroku, or another Node-compatible platform
- MongoDB Atlas or another hosted MongoDB database
- Production environment variables
- Correct CORS settings for the deployed frontend URL
- HTTPS enabled on the deployed services

Before submitting Phase 6, verify:

- The live frontend URL is accessible.
- The backend API works online.
- The frontend can fetch from the deployed backend.
- Login works online.
- Model CRUD works online.
- Analyst visibility rules work online.
- The app works on desktop and mobile.
- Any known bugs are documented.

## Team

- Team Member 1: ABDULLAH ALOTAIBI - Frontend development and Database designer
- Team Member 2: MOHAMMED ALFARAJ - Frontend development and Backend development
- Team Member 3: MOHAMMED ALNASR - Frontend development and Database designer
- Team Member 4: SAAD WAQAS - Frontend development and Backend development
