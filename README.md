# gmail-cleaner
Mobile-first Gmail Cleaner web application for iPhone.

The GitHub Pages version uses the Phase 1 mock data and does not require a
server or Gmail credentials.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000 in a browser on the host machine. To access it from an iPhone on the same network, open `http://<computer-ip>:3000`.

## Free GitHub Pages hosting

1. Push this repository to GitHub.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to the `main` branch (or run **Deploy to GitHub Pages** from the
   Actions tab).

The workflow publishes the `public/` folder at:
`https://<your-github-username>.github.io/gmail-cleaner/`

GitHub Pages hosts the static Phase 1 demo only. The Express server remains
available for local development and future Gmail API integration.
