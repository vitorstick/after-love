# Backend Development Instructions (NestJS)

This document outlines the steps and considerations for developing the backend of your application using NestJS, with deployment targeted for Render and a PostgreSQL database managed by Supabase.

## 1. Project Setup

**Goal:** Create a new NestJS project.

**Instructions:**

- Initialize a new NestJS project.
  - `nest new project-name --package-manager npm` (or `yarn`, `pnpm` if preferred)
- Ensure the project is set up as a standalone backend application.

## 2. Core Backend Development

**Goal:** Implement the application's business logic, APIs, and services.

**Instructions:**

- **Define Modules, Controllers, and Services:** Organize your code logically.
  - For example: `auth` module, `users` module, `products` module, etc.
- **API Endpoints:**
  - Implement RESTful API endpoints as required by your frontend.
  - Consider using DTOs (Data Transfer Objects) for input validation.
  - Example: `POST /api/users/register`, `GET /api/products`
- **Business Logic:** Implement the core functionality of your application within services.
- **Authentication and Authorization:**
  - If applicable, implement authentication (e.g., JWT, OAuth) and authorization mechanisms.
  - Consider using NestJS Guards and Decorators for this.

## 3. Database Integration (PostgreSQL with TypeORM/Prisma)

**Goal:** Connect your NestJS application to the Supabase PostgreSQL database.

**Instructions:**

- **Choose an ORM/Query Builder:**
  - **Recommendation:** TypeORM or Prisma are excellent choices for NestJS with PostgreSQL.
  - Install the necessary packages (e.g., `@prisma/client`, `prisma` for Prisma).
- **Database Configuration:**
  - Configure your database connection using environment variables.
  - The database URL from Supabase will be crucial here.
  - Example `.env` variable: `DATABASE_URL=postgresql://user:password@host:port/database`
  - In NestJS, this often involves setting up a `TypeOrmModule.forRoot()` or Prisma client initialization.
- **Define Entities/Models:**
  - Create your database schema using entities (TypeORM) or models (Prisma).
  - Generate migrations as needed to manage schema changes.
- **Database Interactions:**
  - Implement repository patterns or use the ORM directly within your services to interact with the database (CRUD operations).

## 4. Environment Variables Management

**Goal:** Securely manage sensitive information like database credentials and API keys.

**Instructions:**

- Use the `@nestjs/config` package or a similar library to manage environment variables.
- Create a `.env` file for local development.
- Identify all necessary environment variables:
  - `DATABASE_URL` (from Supabase)
  - `PORT` (e.g., `3000` for local development, Render will expose its own port)
  - Any API keys or secrets used by your backend.
- Ensure your application correctly reads these variables.

## 5. Prepare for Render Deployment

**Goal:** Configure your NestJS application for seamless deployment on Render.

**Instructions:**

- **Port Listening:** Ensure your NestJS application listens on the port provided by the environment, typically `process.env.PORT`.
  - `await app.listen(process.env.PORT || 3000);`
- **Dependencies:** Make sure all production dependencies are correctly listed in `package.json`.
- **Build Script:** Ensure your `package.json` has a `build` script that compiles your TypeScript code to JavaScript.
  - `"build": "nest build"`
- **Start Script:** Ensure your `package.json` has a `start` script that runs the compiled application.
  - `"start": "node dist/main"` (assuming `main.ts` is your entry point)
- **Git Repository:**
  - Commit your code and push it to a remote GitHub repository. This repository will be connected to Render.

## 6. Security Considerations

**Goal:** Implement basic security practices.

**Instructions:**

- **CORS:** Configure Cross-Origin Resource Sharing (CORS) to allow requests from your frontend (Vercel deployment URL).
- **Input Validation:** Use NestJS pipes (e.g., `ValidationPipe`) and class-validator/class-transformer for robust input validation.
- **Error Handling:** Implement centralized error handling.
- **Logging:** Set up a logging mechanism for monitoring.

## 7. Testing

**Goal:** Ensure the backend works as expected.

**Instructions:**

- Write unit tests for your services and controllers.
- Write integration tests for your API endpoints.
- Use Jest or a similar testing framework.

## 8. Post-Deployment Steps (Copilot won't directly do this, but you need to know)

**Goal:** Connect the deployed backend to the frontend and database.

**Instructions:**

- **Supabase Connection:**
  - Once your backend is deployed on Render, go to your Render service settings.
  - Add `DATABASE_URL` as a secret environment variable, using the connection string obtained from Supabase.
- **Frontend Connection:**
  - After your backend is successfully deployed on Render, obtain its public URL.
  - Go to your Vercel frontend project settings.
  - Add an environment variable (e.g., `NEXT_PUBLIC_BACKEND_URL`) and set its value to your Render backend's URL. This allows your frontend to make API requests to your backend.

## Example File Structure (Common NestJS Setup)

project-name/
├── src/
│ ├── main.ts
│ ├── app.module.ts
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.module.ts
│ │ └── auth.service.ts
│ ├── users/
│ │ ├── users.controller.ts
│ │ ├── users.module.ts
│ │ └── users.service.ts
│ └── database/ (e.g., for TypeORM entities, migrations)
├── test/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
