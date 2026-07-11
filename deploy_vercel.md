# Deployment Guide: Asherwoods on Vercel

We have successfully rebuilt the Asherwoods Cafe & Cottages project using a clean **Vite + React + TypeScript** structure. This guarantees a clean, compile-safe deployment.

---

## Method A: Deploy via GitHub (Recommended)

1. Open your terminal.
2. Go to the project folder:
   ```cmd
   cd "c:\Users\ASUS TUF\Documents\New folder (2)"
   ```
3. Stage and push all the clean files:
   ```bash
   git add .
   git commit -m "Rebuild website from scratch with clean React + Vite + TS structure"
   git push origin main
   ```
4. Log in to [vercel.com](https://vercel.com) and import the repository. Vercel will auto-detect the **Vite** preset and deploy the site!

---

## Method B: Direct Drag-and-Drop (No Git)

1. Open your File Explorer to `c:\Users\ASUS TUF\Documents\New folder (2)`.
2. Find the newly built file **`asherwoods.zip`**.
3. Open your browser and go to **[vercel.com/drop](https://vercel.com/drop)**.
4. Drag and drop **`asherwoods.zip`** onto the page. Vercel will upload and compile it in the cloud!
