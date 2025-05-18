# Leavn Project: Replit Environment Guide

This guide provides solutions to common issues that may occur when running this project on Replit.

## Port Configuration

The application runs on port 5000, which is automatically mapped to external port 80 in Replit. This is configured in the `.replit` file.

```toml
[[ports]]
localPort = 5000
externalPort = 80
```

## Troubleshooting Common Issues

### 1. Module Import Errors

If you see errors like `The requested module does not provide an export named 'default'`, check the import statement:

**Problem:**
```typescript
// Importing a named export as default
import SomeComponent from './components/SomeComponent';
```

**Solution:**
```typescript
// Use the correct named export syntax
import { SomeComponent } from './components/SomeComponent';
```

### 2. ThemeProvider Issues

If the theme provider isn't working:

1. Ensure `ThemeProvider.tsx` exists in `client/src/lib/`
2. Make sure it's imported correctly in `App.tsx`:
   ```typescript
   import { ThemeProvider } from './lib/ThemeProvider';
   ```

### 3. Port Conflicts

If you're having trouble with port forwarding or port conflicts:

1. Check `server/index.ts` to ensure it uses the Replit PORT environment variable:
   ```typescript
   const port = Number(process.env.PORT) || 5000;
   ```

2. Verify the `.replit` file has the correct port configuration as shown above.

### 4. Hot Module Reloading Issues

If hot module reloading doesn't work correctly:

1. Restart the application using the "Run" button
2. If needed, run `npm run build` to rebuild the application

## Deployment Tips

When deploying your application:

1. Make sure all your changes are committed
2. Run `npm run build` to create a production build
3. Use the Replit deployment feature to deploy your application

## Important Files

Always avoid directly editing these sensitive configuration files:
- `server/vite.ts`
- `vite.config.ts`
- `drizzle.config.ts`

## After Major Changes

After making significant changes to the application structure or updating dependencies:

1. Run `npm i` to ensure all dependencies are installed
2. Run `npm run dev` to start the development server