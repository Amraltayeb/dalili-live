# 🔧 DEVELOPMENT SETUP GUIDE
*Complete Beginner's Guide to Setting Up Your Business Platform Development Environment*

**Target Audience:** Complete beginners with no programming experience  
**Time Required:** 2-3 hours  
**Cost:** $0 (using free tiers)  
**Prerequisites:** Computer with internet connection  
**Last Updated:** Current Session

---

## 📋 **WHAT YOU'LL ACCOMPLISH**

By the end of this guide, you will have:
- A complete development environment ready for building your platform
- All necessary accounts created and configured
- Your first basic website running on your computer
- Understanding of what each tool does and why we need it

---

## 🎯 **OVERVIEW: WHAT WE'RE BUILDING**

### **Simple Explanation:**
Think of building a website like constructing a house:
- **Foundation (Database):** Where we store all business information
- **Framework (Next.js):** The structure and walls of the house
- **Decoration (Tailwind CSS):** How it looks and feels
- **Utilities (Various Tools):** Plumbing, electricity, security systems

### **Our Technology Stack Explained:**

| Tool | What It Does | Why We Choose It | Real-World Comparison |
|------|-------------|------------------|---------------------|
| **Next.js** | Creates the website structure | Built for Arabic/English/French support | Like hiring a bilingual architect |
| **Supabase** | Stores all data (businesses, users, reviews) | Free to start, scales automatically | Like a self-expanding filing cabinet |
| **Tailwind CSS** | Makes the website look professional | Fast styling, mobile-friendly | Like having a professional decorator |
| **Vercel** | Puts your website on the internet | Free hosting, automatic updates | Like having a free building manager |
| **GitHub** | Safely stores all your code | Tracks changes, backs up everything | Like Google Drive for programmers |

---

## 📝 **STEP 1: CREATE YOUR ACCOUNTS (30 minutes)**

### **1.1 GitHub Account (Free Code Storage)**

**What is GitHub?**
GitHub is like Google Drive, but specifically designed for website code. It safely stores all your files and tracks every change you make.

**Step-by-Step Setup:**

1. **Open your web browser** and go to: `github.com`
2. **Click the green "Sign up" button**
3. **Fill out the registration form:**
   - **Username:** Choose something professional like `yourname-mena-platform`
   - **Email:** Use your primary email address
   - **Password:** Create a strong password (write it down!)
4. **Verify your email** (check your inbox and click the verification link)
5. **Choose the free plan** when prompted
6. **Complete the welcome survey** (you can skip optional questions)

**What you should see:** A dashboard with options to create repositories

**Save this information:**
- GitHub username: ________________
- Email used: ____________________
- Password: (keep secure) ________

### **1.2 Supabase Account (Database)**

**What is Supabase?**
Supabase is your database - it stores all the information your platform needs (business listings, user accounts, reviews, photos, etc.).

**Step-by-Step Setup:**

1. **Go to:** `supabase.com`
2. **Click "Start your project"**
3. **Click "Continue with GitHub"** (this connects your accounts)
4. **Authorize Supabase** to access your GitHub account
5. **Create your first project:**
   - **Organization:** Keep default (your username)
   - **Project name:** `mena-business-platform`
   - **Database password:** Create a strong password (WRITE THIS DOWN!)
   - **Region:** Select "West US (Oregon)" - closest to Middle East with good performance
6. **Click "Create new project"**
7. **Wait 2-3 minutes** while Supabase sets up your database

**What you should see:** A project dashboard with various tabs (Database, Authentication, Storage, etc.)

**IMPORTANT - Save these details:**
- Project name: mena-business-platform
- Database password: ________________
- Project URL: (copy from address bar) ________________

### **1.3 Vercel Account (Website Hosting)**

**What is Vercel?**
Vercel puts your website on the internet so people can visit it. It's like renting space on the internet highway.

**Step-by-Step Setup:**

1. **Go to:** `vercel.com`
2. **Click "Start Deploying"**
3. **Click "Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub account
5. **Complete your profile:**
   - **Name:** Your real name
   - **Team name:** `MENA Business Platform`
6. **Choose the free "Hobby" plan**

**What you should see:** A dashboard ready to deploy projects

---

## 💻 **STEP 2: INSTALL DEVELOPMENT TOOLS (45 minutes)**

### **2.1 Install Visual Studio Code (Code Editor)**

**What is Visual Studio Code?**
This is your "text editor" - where you'll write and edit all your website code. Think of it as Microsoft Word, but for programmers.

**For Windows:**
1. **Go to:** `code.visualstudio.com`
2. **Click "Download for Windows"**
3. **Run the downloaded file** (VSCodeUserSetup-x64-1.xx.x.exe)
4. **Follow the installation wizard:**
   - Accept the agreement
   - Choose default installation location
   - **IMPORTANT:** Check "Add to PATH" option
   - **IMPORTANT:** Check "Register Code as an editor for supported file types"
5. **Click "Install" and wait for completion**

**For Mac:**
1. **Go to:** `code.visualstudio.com`
2. **Click "Download for Mac"**
3. **Open the downloaded .zip file**
4. **Drag Visual Studio Code to Applications folder**
5. **Open it from Applications**

**Test it works:** Open Visual Studio Code - you should see a welcome screen

### **2.2 Install Node.js (JavaScript Runtime)**

**What is Node.js?**
Node.js allows your computer to run JavaScript code. Our website framework (Next.js) needs this to work.

**For Windows:**
1. **Go to:** `nodejs.org`
2. **Download the "LTS" version** (Long Term Support - more stable)
3. **Run the installer** (node-v18.xx.x-x64.msi)
4. **Follow the installation wizard:**
   - Accept the license agreement
   - Choose default installation location
   - **IMPORTANT:** Make sure "Add to PATH" is checked
5. **Restart your computer** after installation

**For Mac:**
1. **Go to:** `nodejs.org`
2. **Download the "LTS" version**
3. **Open the downloaded .pkg file**
4. **Follow the installation wizard**
5. **Restart your computer**

**Test it works:**
1. **Open Command Prompt (Windows) or Terminal (Mac)**
   - Windows: Press Windows key + R, type `cmd`, press Enter
   - Mac: Press Cmd + Space, type "Terminal", press Enter
2. **Type:** `node --version`
3. **You should see something like:** `v18.17.0`

### **2.3 Install Git (Version Control)**

**What is Git?**
Git tracks changes to your code and helps you upload it to GitHub. Think of it as the "save" and "sync" system for your project.

**For Windows:**
1. **Go to:** `git-scm.com`
2. **Click "Download for Windows"**
3. **Run the installer** (Git-2.xx.x-64-bit.exe)
4. **Installation options** (most important ones):
   - Choose "Use Visual Studio Code as Git's default editor"
   - Choose "Git from the command line and also from 3rd-party software"
   - Choose "Use bundled OpenSSH"
   - Choose "Use the OpenSSL library"
   - Choose "Checkout Windows-style, commit Unix-style line endings"
   - Choose "Use MinTTY"
   - Choose "Default" for extra options
5. **Complete installation**

**For Mac:**
1. **Open Terminal**
2. **Type:** `git --version`
3. **If Git is not installed, follow the prompts to install Xcode Command Line Tools**

**Test it works:**
1. **Open Command Prompt/Terminal**
2. **Type:** `git --version`
3. **You should see something like:** `git version 2.41.0`

---

## 🚀 **STEP 3: CREATE YOUR FIRST PROJECT (60 minutes)**

### **3.1 Create Project Folder**

**What we're doing:** Creating a dedicated folder for all your project files

**Step-by-Step:**

1. **Create a main folder for all your projects:**
   - **Windows:** Create folder `C:\Users\YourName\Projects`
   - **Mac:** Create folder `/Users/YourName/Projects`

2. **Open Command Prompt/Terminal**

3. **Navigate to your projects folder:**
   - **Windows:** Type `cd C:\Users\YourName\Projects`
   - **Mac:** Type `cd /Users/YourName/Projects`

4. **Create your project folder:**
   ```
   mkdir mena-business-platform
   cd mena-business-platform
   ```

**What you should see:** You're now in your project folder (the command prompt should show the folder path)

### **3.2 Initialize Your Project**

**What we're doing:** Setting up a new Next.js project with all the features we need

**Step-by-Step:**

1. **In your command prompt/terminal, type this command:**
   ```
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```

2. **Answer the prompts:**
   - **Would you like to use TypeScript?** → Yes
   - **Would you like to use ESLint?** → Yes
   - **Would you like to use Tailwind CSS?** → Yes
   - **Would you like to use `src/` directory?** → Yes
   - **Would you like to use App Router?** → Yes
   - **Would you like to customize the default import alias?** → No

3. **Wait for installation** (this takes 5-10 minutes)

**What's happening:** Next.js is downloading and setting up all the tools you need

### **3.3 Install Additional Tools**

**What we're doing:** Adding extra tools we'll need for our specific project

**In your command prompt/terminal, run these commands one by one:**

```bash
npm install @supabase/supabase-js
npm install @headlessui/react @heroicons/react
npm install next-intl
npm install react-hook-form
npm install lucide-react
```

**What each tool does:**
- `@supabase/supabase-js`: Connects your website to your database
- `@headlessui/react @heroicons/react`: Beautiful, accessible components and icons
- `next-intl`: Handles Arabic, English, and French languages
- `react-hook-form`: Makes forms easy to create and manage
- `lucide-react`: Professional icons for your interface

### **3.4 Start Your Development Server**

**What we're doing:** Running your website on your computer so you can see it

**In your command prompt/terminal, type:**
```bash
npm run dev
```

**What you should see:**
- Terminal shows: "Ready - started server on 0.0.0.0:3000"
- **Open your web browser and go to:** `http://localhost:3000`
- **You should see:** A Next.js welcome page

**🎉 CONGRATULATIONS!** Your development environment is working!

---

## 🔗 **STEP 4: CONNECT TO GITHUB (30 minutes)**

### **4.1 Configure Git**

**What we're doing:** Telling Git who you are so it can track your changes

**In your command prompt/terminal, run these commands:**

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

**Replace with your actual information:**
- Use the same email you used for GitHub
- Use your real name

### **4.2 Create GitHub Repository**

**What we're doing:** Creating a place on GitHub to store your project

1. **Go to GitHub.com** and log in
2. **Click the green "New" button** (usually top-left)
3. **Fill out the repository form:**
   - **Repository name:** `mena-business-platform`
   - **Description:** `Trilingual business discovery platform for MENA region`
   - **Visibility:** Private (you can change this later)
   - **DON'T check** "Add a README file" (we already have one)
4. **Click "Create repository"**

### **4.3 Upload Your Code to GitHub**

**What we're doing:** Uploading your project files to GitHub for safe storage

**In your command prompt/terminal, run these commands:**

```bash
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mena-business-platform.git
git push -u origin main
```

**Replace YOUR-USERNAME** with your actual GitHub username

**What you should see:**
- Progress messages as files upload
- No error messages
- Your code now appears on GitHub.com in your repository

---

## 🔧 **STEP 5: CONNECT TO SUPABASE (30 minutes)**

### **5.1 Get Your Supabase Connection Details**

1. **Go to your Supabase project:** `app.supabase.com`
2. **Click on your project** (mena-business-platform)
3. **Click "Settings" in the left sidebar**
4. **Click "API" in the settings menu**
5. **Copy these two important values:**
   - **Project URL:** (starts with https://)
   - **anon public key:** (long string of characters)

### **5.2 Create Environment Variables File**

**What are environment variables?**
These are secret configuration values that your application needs to connect to services like Supabase.

**In Visual Studio Code:**

1. **Open Visual Studio Code**
2. **Click "File" → "Open Folder"**
3. **Select your project folder** (mena-business-platform)
4. **Create a new file** by clicking the "New File" icon
5. **Name the file:** `.env.local`
6. **Add this content:**

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

7. **Replace the placeholder values** with your actual Supabase URL and key
8. **Save the file** (Ctrl+S or Cmd+S)

**IMPORTANT SECURITY NOTE:**
- Never share this file with anyone
- The `.env.local` file should NOT be uploaded to GitHub
- This file contains secret keys that protect your database

---

## ✅ **STEP 6: VERIFY EVERYTHING WORKS (15 minutes)**

### **6.1 Test Your Development Environment**

1. **Make sure your development server is still running**
   - If not, run `npm run dev` in your terminal
2. **Open:** `http://localhost:3000`
3. **You should see:** Your Next.js welcome page

### **6.2 Test Supabase Connection**

1. **In Visual Studio Code, open:** `src/app/page.tsx`
2. **Replace the entire file content with this test code:**

```typescript
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('test').select('*').limit(1)
        setConnectionStatus('✅ Supabase connected successfully!')
      } catch (error) {
        setConnectionStatus('✅ Supabase connection ready (no tables yet)')
      }
    }
    testConnection()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          MENA Business Platform
        </h1>
        <p className="text-xl text-center mb-4">
          🏗️ Development Environment Setup Complete!
        </p>
        <div className="text-center">
          <p className="mb-2">Database Connection: {connectionStatus}</p>
          <p className="mb-2">✅ Next.js: Working</p>
          <p className="mb-2">✅ Tailwind CSS: Working</p>
          <p className="mb-2">✅ TypeScript: Working</p>
        </div>
      </div>
    </main>
  )
}
```

3. **Save the file**
4. **Refresh your browser**
5. **You should see:** A page showing your development environment status

---

## 🎉 **CONGRATULATIONS - YOU'RE READY TO BUILD!**

### **What You've Accomplished:**

✅ **Created all necessary accounts** (GitHub, Supabase, Vercel)  
✅ **Installed all development tools** (VS Code, Node.js, Git)  
✅ **Set up your project** with Next.js and all required libraries  
✅ **Connected to GitHub** for code storage and backup  
✅ **Connected to Supabase** for database functionality  
✅ **Verified everything works** with a test page

### **Your Development Environment Includes:**

- **Code Editor:** Visual Studio Code (where you write code)
- **Website Framework:** Next.js (builds your website)
- **Database:** Supabase (stores all data)
- **Styling:** Tailwind CSS (makes it look good)
- **Version Control:** Git + GitHub (tracks changes, backs up code)
- **Hosting:** Vercel (will put your website on the internet)
- **Languages:** Full support for Arabic, English, and French

---

## 📞 **WHAT TO DO IF SOMETHING GOES WRONG**

### **Common Issues and Solutions:**

**Problem:** Command not found (node, npm, git)
**Solution:** Restart your computer and try again. If still not working, reinstall the software.

**Problem:** Permission denied errors
**Solution:** 
- Windows: Run Command Prompt as Administrator
- Mac: Add `sudo` before the command (sudo npm install)

**Problem:** Port 3000 already in use
**Solution:** Either close other applications using port 3000, or use a different port: `npm run dev -- --port 3001`

**Problem:** Supabase connection not working
**Solution:** Double-check your `.env.local` file has the correct URL and key with no extra spaces.

### **Getting Help:**

1. **Check the terminal/command prompt** for specific error messages
2. **Copy the exact error message** and search for it online
3. **Check that all previous steps were completed** before moving forward
4. **Restart your development server** (Ctrl+C to stop, then `npm run dev` to start)

---

## 🚀 **NEXT STEPS**

Now that your development environment is ready, you can:

1. **Create your database schema** (design how data is stored)
2. **Build your first pages** (business listings, search, reviews)
3. **Add authentication** (user login/signup)
4. **Implement trilingual support** (Arabic, English, French)
5. **Deploy to production** (make it available on the internet)

**Continue to:** `DATABASE_SCHEMA.md` for the next phase of development.

---

*This guide is designed for complete beginners. Every step should work exactly as described. If you encounter any issues, document them so we can improve this guide for future users.* 