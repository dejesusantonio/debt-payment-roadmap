# Debt Payment Roadmap

An interactive prototype for a personal-finance app that helps users plan, simulate, and track debt payoff. Built as a single-file React app (via Babel-in-browser) with no build step.

**Live entry point:** [`Throughline.html`](./Throughline.html)

## What's inside

| Tab | Purpose |
|---|---|
| **Roadmap** | Avalanche / snowball / custom payoff timeline with a focus debt and "crushing fund" extras |
| **Inventory** | Edit, reorder, add/remove debts; shows total balance, min payments, and APR-weighted cost |
| **Simulator** | Five income strategies (Asset Flip, Rideshare, Delivery, Freelance, Sell) with net-cash modeling and a "Schedule snowflake" action that queues an extra payment to the debt of your choice |
| **Accounts** | Plaid-style connected accounts, data-health checks, and a recent-automations feed |

The app uses a small "Tweaks" panel (toggleable from the toolbar) to switch between tones, density, accent colors, and feature flags.

## Project structure

```
Throughline.html      ← bundled, self-contained app (open this)
index.html            ← landing page that redirects to Throughline.html
Atelier Nord.html     ← earlier visual exploration (optional)
styles.css            ← shared styles (also inlined into Throughline.html)
*.jsx                 ← source modules; these are inlined into Throughline.html
```

The `.jsx` files are the readable source for each feature area (`roadmap`, `inventory`, `simulator`, `accounts`, `data`, `icons`, `app`, `tweaks-panel`). The `Throughline.html` bundle is the canonical, deployable build — it concatenates all of these so the app runs from a single file with no tooling.

## Run locally with VS Code

1. Install the **Live Server** extension (recommended — see `.vscode/extensions.json`).
2. Open this folder in VS Code.
3. Right-click `index.html` (or `Throughline.html`) → **Open with Live Server**.
4. The app opens at `http://127.0.0.1:5500`.

You can also just double-click `Throughline.html` to open it in a browser — no server required.

## Deploy to GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included that publishes the site to GitHub Pages on every push to `main`.

### One-time setup

1. Push this repo to GitHub.
2. In the repo settings, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Push from VS Code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/<repo-name>.git
git push -u origin main
```

Or use the **Source Control** panel in VS Code (Ctrl/Cmd+Shift+G) → "Publish to GitHub".

## Tech notes

- React 18 + Babel Standalone, loaded from unpkg with pinned integrity hashes.
- No build step, no npm dependencies — everything renders from the single HTML file.
- All data is in-memory (sample data in `data.jsx`); refreshing resets state.

## License

MIT — see [LICENSE](./LICENSE).
