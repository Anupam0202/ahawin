# GitHub and Vercel release guide

The repository is prepared locally. Publication was not performed because GitHub/Vercel authentication, account selection, and public-release authorization were not available in the sandbox.

Default to a **private** GitHub repository. Switch to public only when the team explicitly authorizes release.

## 1. Unpack and verify

```bash
unzip AhaWin-hackathon-ready.zip
cd ahawin
node --version
npm run verify
```

Node.js must be version 20 or newer. Do not create `.env` before the repository is committed unless needed; `.env` is ignored, but a clean release avoids unnecessary secret handling.

## 2. Inspect exactly what will be published

```bash
git init
git branch -M main
git status --short
git diff --check
bash scripts/secret-scan.sh
find . -maxdepth 3 -type f -not -path './.git/*' | sort
```

Confirm that no `.env`, API key, token, private student work, terminal log, recording, or unrelated archive appears.

## 3A. Create and push with GitHub CLI

Authenticate through GitHub's official browser/device flow. Do not paste a token into chat or a remote URL.

```bash
gh auth login
gh auth status
git add .
git diff --cached --check
git status --short
git commit -m "feat: ship AhaWin misconception-twin learning loop"
gh repo create ahawin --private --source=. --remote=origin --push
```

When public release is explicitly authorized, change visibility after review:

```bash
gh repo edit --visibility public
```

GitHub asks for confirmation before a visibility change.

## 3B. Push without GitHub CLI

Create an empty private repository named `ahawin` in the GitHub web interface. Do not initialize it with a README, license, or `.gitignore`, because those files already exist.

```bash
git add .
git diff --cached --check
git status --short
git commit -m "feat: ship AhaWin misconception-twin learning loop"
git remote add origin https://github.com/OWNER/ahawin.git
git push -u origin main
```

Replace only `OWNER`. Use GitHub's official credential manager or browser sign-in; never put a token in the URL.

## 4. Enable repository protection

In GitHub:

1. Open **Settings → Code security and analysis**.
2. Enable secret scanning and push protection if the plan supports them.
3. Open the Actions tab and confirm the `verify` workflow passes.
4. Check the public file tree once more before changing visibility.

## 5. Import into Vercel for automatic deployments

1. Sign in to Vercel using the GitHub account that owns the repository.
2. Open `https://vercel.com/new`.
3. Select **Import Git Repository** and choose `ahawin`.
4. Set the framework preset to **Other** if Vercel does not detect it automatically.
5. Leave **Build Command** empty.
6. Leave **Output Directory** empty.
7. Keep the project root as `.`.
8. Add `GEMINI_API_KEY` through Vercel's encrypted environment-variable UI for **Production** and **Preview** as needed.
9. Add `GEMINI_MODEL=gemini-3.8-flash` only if an explicit model setting is desired.
10. Add `ALLOW_DEMO_FALLBACK=false`.
11. Deploy.

Once imported from GitHub, every push to `main` creates a new production deployment under the project's configured Git settings; pull requests create previews when enabled.

## 6. Optional Vercel CLI flow

Use only the official interactive login and secret prompts.

```bash
npm install --global vercel
vercel login
vercel link
vercel env add GEMINI_API_KEY production
vercel env add GEMINI_API_KEY preview
vercel env add GEMINI_MODEL production
vercel env add ALLOW_DEMO_FALLBACK production
vercel --prod
```

When prompted, enter secrets into the Vercel prompt—not source files, shell history, documentation, or chat.

## 7. Production smoke test

Replace `https://YOUR-PROJECT.vercel.app` only after Vercel returns the real URL.

```bash
curl -fsS https://YOUR-PROJECT.vercel.app/api/health
curl -fsSI https://YOUR-PROJECT.vercel.app/
```

Then verify in a browser:

1. Hero and workbench load with no console error.
2. Guided demo completes through trace confirmation, contradiction, teach-back, and transfer.
3. A real image/typed request shows **LIVE GEMINI** and returns a relevant trace.
4. Custom analysis failure never displays unrelated sample work.
5. Mobile layout has no horizontal scroll.
6. Keyboard focus remains visible.
7. Network responses and downloaded browser assets contain no key.
8. `/api/health` says `geminiConfigured: true` but never returns the key.
9. Vercel logs contain no image body or secret.

Environment-variable changes require a new deployment.

## 8. Add final URLs

Update these README placeholders only after verification:

- deployed app URL,
- two-minute video URL,
- final team credits.

Commit and push:

```bash
git add README.md
git diff --cached --check
git commit -m "docs: add verified demo and deployment links"
git push
```

## 9. Final release archive

From the parent directory:

```bash
cd ..
zip -r AhaWin-hackathon-ready.zip ahawin \
  -x 'ahawin/.git/*' 'ahawin/.env' 'ahawin/.env.*' 'ahawin/node_modules/*' 'ahawin/.vercel/*' 'ahawin/*.log'
```

Keep `.env.example`; it contains names and placeholders only.
