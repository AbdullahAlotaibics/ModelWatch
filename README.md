# Model Watch

Model Watch is a front-end prototype for a model management platform used to organize, review, and compare machine learning models. The application includes separate experiences for administrators, model owners, and analysts, with role-based navigation and dashboard views.

## Features

- Admin workspace for user, category, and issue management
- Owner dashboard for managing owned models and reviewing portfolio activity
- Analyst dashboard for browsing accessible models and filtering by category or visibility
- Analyst actions inside model view:
   - Add analyical notes
   - Flag models
   - export model summary
- Flagged models are submitted to the admin Issue Management sections
- Shared comparison workflow for reviewing multiple models side by side
- Demo login flow for switching between supported roles during development
- Role based navigation and protected routes

## Tech Stack

- React 19
- Vite
- React Router
- Page-level CSS

## Dependencies and Frameworks Used

### React

React is the main front-end library used to build the interface as reusable components. Each page in the project, such as the admin workspace, owner dashboard, and analyst dashboard, is implemented as a React component.

### Vite

Vite is the development and build tool used for this project. It provides:

- Fast local development startup
- Hot module replacement during UI changes
- Simple production build generation

### React Router

React Router is used for client-side navigation. It handles:

- Login redirection based on user role
- Protected routes for admin, owner, and analyst users
- Nested layouts such as the shared owner area and admin area

### ESLint

ESLint is included to maintain code quality and catch common problems during development. The project uses it to validate React hooks usage, general JavaScript issues, and front-end code consistency.

### Plain CSS

The interface styling is written in regular CSS files rather than a component library or utility framework. This keeps the project straightforward to review and makes it easier to trace each page's design rules directly in the source files.

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

### Available demo accounts

- Admin User: `admin@modelwatch.com` / `admin123`
- John Owner: `owner@modelwatch.com` / `owner123`
- Sarah Analyst: `analyst@modelwatch.com` / `analyst123`

### How to use the application

1. Run `npm run dev`.
2. Open the local URL printed by Vite in your browser.
3. On the login page, enter one of the demo account credentials.
4. After login, the system redirects automatically based on the selected account role.

### Admin usage

When signed in as an admin:

1. Use the top navigation bar to move between Dashboard, Users, Categories, and Issues.
2. Open the Users page to:
   - Search users by name or email
   - Add a new user
   - Edit an existing user
   - Delete a user, except admin accounts
3. Open the Categories page to:
   - Add a category
   - Edit category details
   - Remove a category after confirmation
4. Open the Issues page to:
   - Review reported issues
   - Review issues submitted from flagged models
   - Change issue status
   - Add a resolution note and mark an issue as resolved
5. Use the Logout button in the top-right corner to return to the login screen.

### Owner usage

When signed in as a model owner:

1. The landing page shows the owner dashboard with the models assigned to that owner account.
2. Use the dashboard to:
   - Review model counts and update totals
   - Search owned models by name or description
   - Filter owned models by visibility
   - Open the comparison workflow
3. Use the navigation bar to move between:
   - Dashboard
   - Browse Models
   - Compare
4. Open a model to view:
   - Overview
   - History
   - Analytical Notes
5. Owners can create and edit their models from the detail view or edit form.

### Analyst usage

When signed in as an analyst:

1. The landing page changes to the analyst dashboard automatically.
2. The analyst dashboard displays only public and shared models.
3. Use the dashboard to:
   - Search models by name or description
   - Filter by category
   - Filter by visibility
   - Review accessible models and note counts
   - Open the comparison page
4. The comparison page allows the analyst to:
   - Select up to four accessible models
   - Choose which attributes to compare
   - Review shared model properties side by side
5. Flagged models are sent to the admin Issues page for follow-up.

### Example test flow

1. sign in as `owner@modelwatch.com`.
2. Create a new model, then open and edit it.
3. Use Compare to compare multiple owned models.
4. Log out and Sign in as `analyst@modelwatch.com`.
5. Open a model from the browse page.
6. Add an analytical note to a model in the Analytical Notes tab.
7. Flag the model using the Flag button.
8. Export the model summary.
9. Log out and sign in as `admin@modelwatch.com`.
10. Open Issues and confirm the flagged model appeared in the issue list.
11. Update the issue status or resolve it.


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

- Team Member 1: ABDULLAH ALOTAIBI - [Frontend development]
- Team Member 2: MOHAMMED ALFARAJ - [Frontend development]
- Team Member 3: MOHAMMED ALNASR - [Frontend development]
- Team Member 4: SAAD WAQAS - [Frontend development]

## Front-End Configuration

This project currently runs without required API keys or environment variables because it uses local mock data and a demo authentication flow.
