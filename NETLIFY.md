# Netlify Deployment Guide for Alpha Calisthenics

This document provides instructions on how to set up and deploy the Alpha Calisthenics website on Netlify.

## Frontend Configuration

The `netlify.toml` file is already configured with the following settings:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: SPA redirects are configured to handle client-side routing.

## Environment Variables

You **must** configure the following environment variables in the Netlify Dashboard (**Site Settings > Build & deploy > Environment variables**):

| Variable | Description | Source |
| :--- | :--- | :--- |
| `APP_URL` | The URL of your deployed site. | Provided by Netlify (e.g., `https://alpha-calisthenics.netlify.app`). |

## Deployment Steps

1. **Connect to GitHub**: Link your repository to a new Netlify site.
2. **Set Build Settings**: Netlify should automatically detect `netlify.toml`.
3. **Set Environment Variables**: Add the `APP_URL` variable.
4. **Deploy**: Trigger the initial deploy.

## Backend (Optional)

Currently, the Express backend is in the `/server` directory. If you wish to host it on Netlify:
1. We recommend deploying it as a **Netlify Function**.
2. You will need to provide a `DATABASE_URL` for your PostgreSQL database.
3. If you prefer a persistent server, we recommend hosting the `/server` folder on **Render.com** or **Railway.app**.
