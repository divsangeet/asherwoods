# Deployment Guide: Asherwoods on Vercel

We have initialized a local Git repository and committed all the luxury resort assets. Follow these simple steps to push the code to your GitHub account and deploy it on Vercel.

---

## Step 1: Push Code to GitHub

1. Open **Command Prompt** or **PowerShell** on your computer.
2. Go to the project folder:
   ```cmd
   cd "c:\Users\ASUS TUF\Documents\New folder (2)"
   ```
3. Create a new **Public** or **Private** repository on [GitHub](https://github.com/new). Name it something like `asherwoods-cafe-cottages`.
4. Link this local folder to your new GitHub repository (replace `<YOUR_GITHUB_URL>` with your actual repo link):
   ```bash
   git remote add origin <YOUR_GITHUB_URL>
   git branch -M main
   git push -u origin main
   ```
   *(If prompted, sign in to your GitHub account in the terminal window).*

---

## Step 2: Deploy to Vercel

1. Log in to your dashboard on [Vercel](https://vercel.com).
2. Click **"Add New"** -> **"Project"** in the top right corner.
3. Under "Import Git Repository", select your GitHub account and find `asherwoods-cafe-cottages`. Click **"Import"**.
4. Vercel will auto-detect that it is a static web application. Leave all settings as default:
   * **Framework Preset**: *Other* (or *Vite* if you compile it later, but Vercel serves standard static files instantly).
   * **Build and Output Settings**: Default (Vercel will directly serve the root files since it's a static site).
5. Click **"Deploy"**.
6. Within 10 seconds, Vercel will deploy your site and provide a free secure public link (e.g. `asherwoods-cafe-cottages.vercel.app`)!

---

## Direct Vercel CLI Option (Alternative)

If you have Node.js and NPM installed in the future and want to deploy directly from your command line without GitHub:
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in and deploy:
   ```bash
   vercel login
   vercel --prod
   ```
