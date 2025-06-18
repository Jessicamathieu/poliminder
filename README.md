# Firebase Studio

This is a Next.js starter built with Firebase Studio. Below are the basic steps
to set up a development environment.

## Requirements

- **Node.js**: version 20.x is recommended. You can verify your version with
  `node -v`.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and populate it with your Firebase
   project credentials:

   ```bash
   cp .env.example .env
   # edit .env and replace the placeholder values with your real Firebase keys
   ```

## Running the development server

Start the Next.js development server with Turbopack:

```bash
npm run dev
```

If you need to work with Genkit flows, run them in a separate terminal:

```bash
npm run genkit:dev
```

For automatic reloading of flows during development you can use
`npm run genkit:watch` instead.

To explore the project, start with `src/app/page.tsx`.
