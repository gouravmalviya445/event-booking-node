
# Event Booking System — Node Backend

This is the Node.js backend for the Event Booking System project. It provides user authentication, event management. The backend is written in TypeScript and uses Express + Mongoose.

## Tech stack

- Node.js (TypeScript)
- Express
- MongoDB (Mongoose)
- Zod for validation
- JWT for authentication
- pnpm / tsx for running TypeScript directly

## Repository layout (important parts)

- `src/` — application source code
	- `app.ts` — express app configuration
	- `index.ts` — server entrypoint
	- `env.ts` — environment variables
	- `controllers/` — request handlers
	- `routes/` — route definitions (`userRouter`, `eventRouter`, `bookingRouter`)
	- `db/` — DB helpers and `seed.ts`
	- `models/` — Mongoose models
	- `middlewares/` — authentication & global middleware
	- `schema/` — request validation schemas
	- `utils/` — utility classes/functions
