# Candidate Management Application

This is a full-stack application for managing candidates with the ability to upload their data via Excel files.

## Project Structure

- `frontend/` - Angular 16+ frontend application
- `backend/` - NestJS backend API

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn
- Angular CLI (for frontend)
- NestJS CLI (for backend)

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

   The frontend will be available at `http://localhost:4200`

## Running Tests

### Backend Tests

```bash
# Unit tests
cd backend
npm test
```

### Frontend Tests

```bash
# Unit tests
cd frontend
ng test

# E2E tests with Cypress
npx cypress open  # Interactive mode
# or
npx cypress run   # Headless mode
```

## API Endpoints

- `GET /candidates` - Get all candidates
- `POST /candidates/upload` - Upload a new candidate with Excel file

## Development

### Backend

The backend is built with NestJS and uses SQLite for data storage. The database is automatically created and migrated when the application starts.

### Frontend

The frontend is built with Angular 16+ using standalone components and Angular Material for the UI.

## Testing Strategy

- **Unit Tests**: Test individual components and services in isolation
- **Integration Tests**: Test the interaction between components and services
- **E2E Tests**: Test the application from the user's perspective

## License

This project is licensed under the MIT License.
