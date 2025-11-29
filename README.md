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
