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
