# SmartTex Prototype

SmartTex is an Arabic-first, role-based fabric retail management prototype. It demonstrates connected workflows for customer sales, inventory monitoring, smart reordering, purchase orders, approvals, supplier communication, receiving, installments, payments, alerts, reports, and audit history.

## Run locally

Serve this directory with any static web server. For example:

```powershell
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## Presentation reset

Normal page refreshes preserve the current browser state. To restore all seeded data, alerts, approvals, and workflow progress, open:

```text
/?fresh=1#dashboard
```

For a deployed site, use a URL such as:

```text
https://your-site.netlify.app/?fresh=1#dashboard
```

## Deploy to Netlify

This repository is a static site with `index.html` at its root. It can be deployed directly through Netlify by importing the repository. No build command or publish-directory change is required.

## Data

This is a front-end prototype. Data is stored in the browser using local storage; it does not connect to a production database or backend.
