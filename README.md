# Leavn

Leavn is a Bible study application that combines a React front end with an Express API. It provides AI-assisted tools for exploring scripture, cross references, and other resources.

## Installation

```bash
pnpm install
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and provide values for the API keys:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
PORT=5000
```

## Development

Run the development server for both the API and UI:

```bash
pnpm dev
```

## Testing

Execute the Node-based test suite with:

```bash
pnpm test
```

## Continuous Integration

The project enforces several CI rules described in `CONTRIBUTING.md`:

- **One Reader rule** – all Bible rendering logic must stay in `client/src/components/Reader.tsx`; creating another `Reader*.tsx` file will fail CI.
- **Pre-commit hooks** run `pnpm guard + lint`; fix any issues before pushing.
- **Pull requests** trigger GitHub Actions and must pass before merge.

