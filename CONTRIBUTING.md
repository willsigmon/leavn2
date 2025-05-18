## Contributing to **Leavn**

1. **One Reader rule** – All Bible rendering logic lives in `client/src/components/Reader.tsx`.  
   Creating another `Reader*.tsx` will fail CI (see `scripts/dup-check.js`).

2. **Run `pnpm dev`** – It spins up both API (`localhost:5000`) and UI (`localhost:5173`).

3. **Add env vars** – Copy `server/.env.example` to `server/.env`.

4. **Pre-commit hooks** run `pnpm guard + lint`.  Fix issues before pushing.

5. **Pull requests** trigger GitHub Actions; they must pass before merge.