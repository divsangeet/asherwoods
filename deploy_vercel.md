# Deployment Guide: Asherwoods on Vercel (TypeScript Version)

We have successfully migrated the Asherwoods Cafe & Cottages project to a **compiled Vite + React + TypeScript** structure. This fixes the build issues on Vercel.

---

## Step 1: Push Code to GitHub

Since your local repository is already linked and has the new changes committed, you only need to run this command in your own terminal (PowerShell or Command Prompt) to upload the code:

1. Open your terminal.
2. Go to the project folder:
   ```cmd
   cd "c:\Users\ASUS TUF\Documents\New folder (2)"
   ```
3. Push the new commit:
   ```bash
   git push origin main
   ```
   *(If prompted, authorize GitHub in your browser).*

---

## Step 2: Deploy to Vercel

If you haven't imported the project into Vercel yet, follow these steps:
1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New"** -> **"Project"** in the top right corner.
3. Find your `asherwoods` repository under "Import Git Repository" and click **"Import"**.
4. Vercel will **auto-detect** that it is a **Vite** project. Keep all settings at their default:
   * **Framework Preset**: *Vite* (auto-detected)
   * **Build Command**: `npm run build` (runs `tsc && vite build` which compiles the TS/TSX files)
   * **Output Directory**: `dist` (Vite's build output folder)
5. Click **"Deploy"**.

If you had already imported the project previously, Vercel will **automatically trigger a new deployment** as soon as you run `git push origin main`. The build will now compile successfully and produce your live website URL!
