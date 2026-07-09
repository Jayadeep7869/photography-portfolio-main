# 📸 LensArt — Complete Git & GitHub Guide

A step-by-step guide to set up **version control** for your Photography Portfolio project
and push it to GitHub, from first command to final submission.

---

## 📋 Table of Contents
1. [What is Git & Why Use It?](#1-what-is-git--why-use-it)
2. [Install Git](#2-install-git)
3. [Configure Git (First Time Only)](#3-configure-git-first-time-only)
4. [Initialize Your Repository](#4-initialize-your-repository)
5. [Your First Commit](#5-your-first-commit)
6. [Create a GitHub Repository](#6-create-a-github-repository)
7. [Push Code to GitHub](#7-push-code-to-github)
8. [Daily Workflow (Saving Changes)](#8-daily-workflow-saving-changes)
9. [Useful Git Commands Reference](#9-useful-git-commands-reference)
10. [Understanding Project File Structure](#10-understanding-project-file-structure)
11. [Tips for College Submission](#11-tips-for-college-submission)

---

## 1. What is Git & Why Use It?

**Git** is a *version control system* — it tracks every change you make to your code.

Think of it like **"save checkpoints"** for your project:
- Never lose your work
- Go back to any previous version
- Collaborate with teammates
- Share your project online via **GitHub**

**GitHub** is the website where you store your Git repositories online.

---

## 2. Install Git

### Windows
1. Go to → https://git-scm.com/download/win
2. Download the installer and run it
3. Accept all default options
4. Open **Git Bash** or **Command Prompt** (or **PowerShell**)

### Verify Installation
```bash
git --version
```
You should see something like: `git version 2.43.0.windows.1`

---

## 3. Configure Git (First Time Only)

Tell Git who you are (this information appears on your commits):

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your@email.com"
```

**Example:**
```bash
git config --global user.name "Jane Smith"
git config --global user.email "jane.smith@example.com"
```

Verify your settings:
```bash
git config --list
```

---

## 4. Initialize Your Repository

Open **Git Bash** or **PowerShell** and navigate to your project folder:

```bash
# Navigate to your project
cd C:\Users\HP\photography
```

> 💡 **Tip:** In File Explorer, you can right-click inside the `photography` folder
> and choose **"Open Git Bash here"** to skip the `cd` command.

Initialize Git in the folder:
```bash
git init
```

You should see:
```
Initialized empty Git repository in C:/Users/HP/photography/.git/
```

Check the current status:
```bash
git status
```

---

## 5. Your First Commit

### Step 1 — Create a `.gitignore` file

This tells Git to ignore system files:

```bash
# Create .gitignore (run in Git Bash / PowerShell)
echo ".DS_Store" > .gitignore
echo "Thumbs.db" >> .gitignore
echo "*.log" >> .gitignore
```

Or create a file named `.gitignore` manually with this content:
```
.DS_Store
Thumbs.db
*.log
node_modules/
```

### Step 2 — Stage All Files

```bash
git add .
```

The `.` means "add everything in this folder".

Check what's staged:
```bash
git status
```

You'll see all files listed in **green** (staged, ready to commit).

### Step 3 — Make Your First Commit

```bash
git commit -m "Initial commit: photography portfolio with auth"
```

The `-m` flag adds a message describing what you did.

> ✅ **Good commit messages** are short and descriptive:
> - `"Add login page with form validation"`
> - `"Fix navbar scroll effect on mobile"`
> - `"Add Alex Chen gallery with 12 photos"`

---

## 6. Create a GitHub Repository

1. Go to **https://github.com** and log in (or create a free account)

2. Click the **"+"** button (top-right) → **"New repository"**

3. Fill in:
   - **Repository name:** `photography-portfolio`
   - **Description:** `Photography portfolio college project with auth system`
   - **Visibility:** Public (so your professor can see it)
   - ❌ Do **NOT** tick "Initialize with README" (we already have files)

4. Click **"Create repository"**

5. GitHub will show you commands — copy the **HTTPS URL**, e.g.:
   ```
   https://github.com/yourusername/photography-portfolio.git
   ```

---

## 7. Push Code to GitHub

Back in your terminal, run these commands one by one:

### Step 1 — Rename the default branch to `main`
```bash
git branch -M main
```

### Step 2 — Connect your local repo to GitHub
```bash
git remote add origin https://github.com/yourusername/photography-portfolio.git
```
> ⚠️ Replace `yourusername` with your actual GitHub username!

### Step 3 — Push your code
```bash
git push -u origin main
```

GitHub will ask for your **username** and **password** (or personal access token).

> 🔑 **Note:** GitHub no longer accepts plain passwords.
> Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token.
> Use that token as your password.

### Verify

Visit: `https://github.com/yourusername/photography-portfolio`

You should see all your project files! 🎉

---

## 8. Daily Workflow (Saving Changes)

Every time you make changes to your project, follow this 3-step cycle:

```bash
# Step 1: Check what changed
git status

# Step 2: Stage your changes
git add .
# or stage a specific file:
git add index.html

# Step 3: Commit with a message
git commit -m "Describe what you changed"

# Step 4: Push to GitHub
git push
```

### Example Workflow

```bash
# After editing gallery.css:
git status
# Shows: modified: css/gallery.css

git add css/gallery.css
git commit -m "Improve masonry grid spacing on mobile"
git push
```

---

## 9. Useful Git Commands Reference

| Command | What it does |
|---------|-------------|
| `git init` | Initialize a new repo in the current folder |
| `git status` | Show what files changed / are staged |
| `git add .` | Stage ALL changed files |
| `git add filename` | Stage a specific file |
| `git commit -m "msg"` | Save a snapshot with a message |
| `git push` | Upload commits to GitHub |
| `git pull` | Download latest changes from GitHub |
| `git log` | View commit history |
| `git log --oneline` | Compact commit history |
| `git diff` | See exact changes before staging |
| `git restore filename` | Undo changes to a file (dangerous!) |
| `git branch` | List all branches |
| `git checkout -b feature-name` | Create a new branch |
| `git merge feature-name` | Merge a branch into current |
| `git remote -v` | Show connected remotes |
| `git clone <url>` | Clone a repo from GitHub |

---

## 10. Understanding Project File Structure

```
photography/                    ← Root of your project
│
├── index.html                  ← 🏠 Home page
├── login.html                  ← 🔐 Login page
├── signup.html                 ← 📝 Signup page
├── forgot-password.html        ← 🔑 Forgot password page
├── dashboard.html              ← 📊 Protected user dashboard
│
├── photographer/               ← Photographer profile pages
│   ├── alex.html               ← Alex Chen (Landscape)
│   ├── maya.html               ← Maya Rodriguez (Portrait)
│   └── sofia.html              ← Sofia Andersson (Street)
│
├── css/                        ← Stylesheets
│   ├── style.css               ← Global styles (navbar, hero, cards)
│   ├── auth.css                ← Auth form styles
│   └── gallery.css             ← Photographer profile + gallery + lightbox
│
├── js/                         ← JavaScript
│   ├── auth.js                 ← Authentication (localStorage-based)
│   ├── gallery.js              ← Masonry gallery + lightbox
│   └── main.js                 ← Global behavior (scroll, animations)
│
├── assets/
│   └── images/                 ← Photographer profile images
│       ├── alex.jpg
│       ├── maya.jpg
│       └── sofia.jpg
│
├── .gitignore                  ← Files to ignore
└── GIT_GUIDE.md                ← This file!
```

---

## 11. Tips for College Submission

### Before Submitting
- [ ] Test all pages in the browser
- [ ] Test login/signup/logout/forgot-password flows
- [ ] Check all photographer galleries open correctly
- [ ] Make sure all links work (no broken pages)
- [ ] Push your final commit to GitHub
- [ ] Check GitHub to confirm all files are uploaded

### Final Commit
```bash
git add .
git commit -m "Final submission: complete photography portfolio project"
git push
```

### Share Your Project
Submit your GitHub link, e.g.:
```
https://github.com/yourusername/photography-portfolio
```

Or open `index.html` directly in a browser for a local demo.

### Enable GitHub Pages (Optional — Free Hosting!)
1. Go to your GitHub repo
2. Click **Settings** → **Pages** (in the sidebar)
3. Under **Source**, select `main` branch
4. Click **Save**
5. Your site will be live at:
   ```
   https://yourusername.github.io/photography-portfolio
   ```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│         GIT QUICK REFERENCE                 │
│                                             │
│  Setup:                                     │
│  git init          → start tracking         │
│  git config        → set your name/email    │
│                                             │
│  Every Save:                                │
│  git add .         → stage changes          │
│  git commit -m ""  → save snapshot          │
│  git push          → upload to GitHub       │
│                                             │
│  Check:                                     │
│  git status        → what changed?          │
│  git log           → history                │
│                                             │
└─────────────────────────────────────────────┘
```

---

*Made with ❤️ for the LensArt Photography Portfolio College Project*


