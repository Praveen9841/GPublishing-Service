# GPublishing Service

Simple static site with an Express server that handles contact/appointment email using SMTP.

Quick start

1. Install Node.js (LTS) from https://nodejs.org/ and restart your terminal.
2. Install dependencies:

```powershell
npm install
```

3. Create a `.env` file in the project root with these variables (do NOT commit this file):

```
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_smtp_password_or_app_password
PORT=3000
```

4. Run the project:

```powershell
npm start
```

5. Open `http://localhost:3000` (or the `PORT` you set).

Notes

- The repository already contains a `.gitignore` that excludes `node_modules/` and `.env`.
- If port 3000 is in use, set `PORT` in `.env` or start with an environment variable:

```powershell
$env:PORT=3001; npm start
```

Render (recommended for full functionality)

1. Create a free account at https://render.com and connect your GitHub account.
2. Create a new **Web Service** and select the `GPublishing-Service` repository and branch `main`.
3. Set the **Environment** to `Node` and the **Start Command** to:

```
node server.js
```

4. Add environment variables in the Render dashboard (**Environment** → **Environment Variables**):

- `SMTP_USER` = your SMTP email
- `SMTP_PASS` = your SMTP password / app password
- `PORT` = `3000` (Render provides its own port mapping; ensure the server reads `process.env.PORT`)

5. Deploy. Render will build and provide a public URL where the full app (including contact/email features) will run.

Alternative automated deployment

If you want to use Infrastructure as Code, the repository includes `render.yaml`. You can use Render's dashboard to import this YAML to create the service automatically.

Automatic deploy from GitHub to Render (GitHub Actions)

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-to-render.yml` that triggers a Render deploy when you push to `main`.

Before the workflow can trigger a deploy, add these repository secrets in GitHub (Settings → Secrets and variables → Actions):

- `RENDER_API_KEY` — a Render API key with deploy permissions. Create one in Render under Account → API Keys.
- `RENDER_SERVICE_ID` — the ID of the Render Web Service you created (Settings → General → Service ID in the Render dashboard).

How it works:
- The workflow calls `POST https://api.render.com/v1/services/{SERVICE_ID}/deploys` using your `RENDER_API_KEY`.
- Render will then start a new deploy using the latest commit from the connected GitHub repository.

Notes:
- The Render service must already be created and connected to this repository for the workflow to trigger a deploy successfully. You can create the service manually in the Render dashboard and set it to use branch `main`.
- If you prefer to deploy manually from the Render dashboard, you do not need to add these secrets.
