# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Todo application built with Nuxt 4 that includes user authentication and complete CRUD functionality for todo items.

### Key Features
- User registration and login with JWT authentication
- Create, read, update, and delete todo items
- Todo item management with status (pending, in_progress, completed) and priority (low, medium, high)
- Responsive UI with Tailwind CSS and DaisyUI
- MySQL database for data persistence

## Technology Stack

### Frontend
- Nuxt 4 (Vue 3)
- Tailwind CSS
- DaisyUI
- Pinia for state management

### Backend
- Nuxt API Routes
- MySQL database
- JWT authentication
- bcryptjs for password hashing

## Project Structure

```
├── app/                    # Main application components and pages
├── assets/                 # CSS and other static assets
├── server/                 # API routes and server plugins
├── stores/                 # Pinia stores for state management
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions and database models
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Project dependencies and scripts
```

## Common Development Tasks

### Starting the Development Server
```bash
npm run dev
```
The application will be available at http://localhost:3000

### Building for Production
```bash
npm run build
```

### Running with PM2 (Production)
The application can be run as a persistent service using PM2:

```bash
# Start the application with PM2
npm run pm2:start

# Stop the application
npm run pm2:stop

# Restart the application
npm run pm2:restart

# Check application status
npm run pm2:status

# View application logs
npm run pm2:logs
```

### Running Tests
There are no specific test scripts configured in this project.

## Code Architecture

### Authentication Flow
1. User registers/logs in through `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and generates JWT token
3. Client stores token in localStorage and uses it for subsequent API requests
4. Auth state is managed with Pinia store (`stores/auth.ts`)

### Todo Management
1. Todos are fetched from `/api/todos` with JWT authentication
2. CRUD operations are available through API endpoints:
   - GET `/api/todos` - Get all todos
   - POST `/api/todos` - Create new todo
   - PUT `/api/todos/[id]` - Update todo
   - DELETE `/api/todos/[id]` - Delete todo
3. Todo state is managed with Pinia store (`stores/todos.ts`)

### Database Schema
The application uses MySQL with two main tables:
- `users` - Stores user information (username, email, password_hash)
- `todos` - Stores todo items with foreign key to users

Database connection is configured in `utils/database.ts` with default credentials:
- Host: localhost
- User: root
- Password: apple
- Database: nuxt_todo_app

### State Management
- `stores/auth.ts` - Manages user authentication state
- `stores/todos.ts` - Manages todo items state

### API Routes
- Authentication: `server/api/auth/`
- Todos: `server/api/todos/`

## Development Notes
- The application uses a global `$fetch` function for API requests
- Tailwind CSS is configured with DaisyUI plugin
- Database tables are automatically created on server startup
- Environment variables should be configured for production deployments