# Model Watch

Model Watch is a front-end prototype for a model management platform used to organize, review, and compare machine learning models. The application includes separate experiences for administrators, model owners, and analysts, with role-based navigation and dashboard views.

## Features

- Admin workspace for user, category, and issue management
- Owner dashboard for managing owned models and reviewing portfolio activity
- Analyst dashboard for browsing accessible models and filtering by category or visibility
- Shared comparison workflow for reviewing multiple models side by side
- Demo login flow for switching between supported roles during development

## Tech Stack

- React 19
- Vite
- React Router
- Page-level CSS

## Setup and Installation

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal, typically `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

### Run linting

```bash
npm run lint
```

## Usage

After starting the app, open the local Vite URL in your browser and sign in with one of the demo accounts shown on the login screen.

### Demo roles

- Admin: access the admin dashboard, user management, categories, and issues
- Owner: access the owner dashboard and model comparison for owned models
- Analyst: access the analyst dashboard and compare accessible public or shared models

### Example workflow

1. Sign in as an admin and open `/admin/users` to add or edit a user.
2. Switch to the Categories or Issues section from the admin navigation bar.
3. Sign in as an owner to review owned models and open the comparison page.
4. Sign in as an analyst to browse accessible models and compare them side by side.

## Project Structure

```text
src/
  Page/          Main page components, shared page data, and page-level styles
  App.jsx        Top-level routing and login flow
  main.jsx       React entry point
  index.css      Global styles
public/          Static assets
```

## Team

Fill these in before submission:

- Team Member 1: [Name] - [Role]
- Team Member 2: [Name] - [Role]
- Team Member 3: [Name] - [Role]
- Team Member 4: [Name] - [Role]

## Front-End Configuration

This project currently runs without required API keys or environment variables because it uses local mock data and a demo authentication flow.

If an API or external service is added later:

1. Store secrets in a local `.env` file.
2. Expose only variables intended for the client with the `VITE_` prefix.
3. Do not commit `.env` files or secret values to source control.

Example:

```bash
VITE_API_BASE_URL=https://example.api
VITE_PUBLIC_APP_NAME=Model Watch
```

Recommended next step if the project is connected to a backend:

- Add a `.env.example` file with variable names only
- Keep real values in `.env.local` or another ignored local file

## Notes for Reviewers

- `node_modules` and build output should not be committed
- Environment files and secrets should remain local
- Demo account credentials are part of the prototype and live in the client for development purposes only
