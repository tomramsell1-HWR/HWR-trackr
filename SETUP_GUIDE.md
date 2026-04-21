# 👶 Little One Tracker — Setup Guide

Follow these steps in order. The whole thing should take about 20–30 minutes.
There's nothing technical here — it's mostly clicking buttons and copying text.

---

## PART 1 — Create a GitHub account (5 mins)

GitHub is just a place to store your code so the hosting service can find it.

1. Go to **https://github.com** and click **Sign up**
2. Enter an email, choose a password, and pick a username (anything is fine)
3. Verify your email address when the confirmation email arrives
4. That's it — you have a GitHub account

---

## PART 2 — Create your Supabase database (10 mins)

Supabase is the free database that both your phones will sync through.

1. Go to **https://supabase.com** and click **Start your project**
2. Sign up with your new GitHub account (click "Continue with GitHub")
3. Click **New project**
4. Fill in:
   - **Name:** baby-tracker (or anything you like)
   - **Database password:** choose something strong and save it somewhere safe
   - **Region:** pick the one closest to you (e.g. West Europe)
5. Click **Create new project** — it takes about 2 minutes to set up

### Create the database table

6. Once your project is ready, click **SQL Editor** in the left sidebar
7. Click **New query**
8. Copy and paste ALL of the text from the file `supabase-setup.sql` into the box
9. Click **Run** (the green button)
10. You should see "Success. No rows returned" — that means it worked ✓

### Get your credentials

11. Click **Project Settings** (the cog icon) in the left sidebar
12. Click **API** in the settings menu
13. You'll see two values you need to copy:
    - **Project URL** — looks like `https://abcdefgh.supabase.co`
    - **anon public key** — a very long string of letters and numbers

14. Open the file `src/supabase.js` in your code
15. Replace `YOUR_SUPABASE_URL` with your Project URL (keep the quotes)
16. Replace `YOUR_SUPABASE_ANON_KEY` with your anon key (keep the quotes)

It should look like this when done:
```
const SUPABASE_URL = 'https://abcdefgh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

---

## PART 3 — Put the code on GitHub (10 mins, Android phone)

Because you're on Android, the easiest approach is to create the files directly
inside GitHub using its website — no terminal or computer needed.

### Create the repository

1. Go to **https://github.com** in Chrome and log in
2. Tap the **+** button (top right) → **New repository**
3. Name it `baby-tracker`
4. Leave everything else as default and tap **Create repository**

### Prepare your files

5. Download the `baby-tracker.zip` to your phone (if you haven't already)
6. Open your phone's **Files** app and find the zip in your Downloads folder
7. Tap and hold the zip → tap **Extract** (or **Unzip**)
   This creates a `baby-tracker` folder with everything inside

8. Before uploading, you need to add your Supabase credentials to one file.
   Install **QuickEdit** (free on Play Store) or any plain text editor app.
   Open `baby-tracker/src/supabase.js` and replace:
   - `YOUR_SUPABASE_URL` with your Project URL from Part 2
   - `YOUR_SUPABASE_ANON_KEY` with your anon key from Part 2
   Save the file.

### Upload your files to GitHub

GitHub lets you upload files directly from your phone via its website.
You'll do this in three batches.

**Batch 1 — Root files:**

9. On your GitHub repository page, tap **Add file** → **Upload files**
10. Tap **choose your files** and navigate to your `baby-tracker` folder
11. Select these files (tap each one):
    - `package.json`
    - `vite.config.js`
    - `index.html`
    - `.gitignore`
    - `supabase-setup.sql`
    - `SETUP_GUIDE.md`
12. Scroll down and tap **Commit changes**

**Batch 2 — The src folder (app code):**

GitHub doesn't let you upload into subfolders directly, so you create these files manually:

13. On your repo page tap **Add file** → **Create new file**
14. In the filename box at the top, type `src/App.jsx`
    (typing the `/` automatically creates the folder)
15. Open `baby-tracker/src/App.jsx` in QuickEdit, select all, copy
16. Paste into the GitHub editor
17. Tap **Commit new file**
18. Repeat steps 13–17 for:
    - `src/main.jsx`
    - `src/supabase.js`

**Batch 3 — Icons:**

19. Tap **Add file** → **Upload files**
20. Navigate to `baby-tracker/public/` and select all three `.png` files
21. Tap **Commit changes**

### Check it worked

22. Your repository page should now show a `src` folder, a `public` folder, and
    the root files. If anything is missing, just go back and add it.

---

## PART 4 — Deploy with Vercel (5 mins)

Vercel will turn your code into a live website automatically.

1. Go to **https://vercel.com** and click **Sign up**
2. Choose **Continue with GitHub** — log in with your GitHub account
3. Click **Add New Project**
4. You'll see your `baby-tracker` repository — click **Import**
5. Leave all settings as default and click **Deploy**
6. Wait about 60 seconds — Vercel will build and deploy your app
7. When it's done, you'll see a **Congratulations** screen with your URL
   (it'll be something like `baby-tracker-abc123.vercel.app`)

---

## PART 5 — Add to your home screens (5 mins)

### Android (your phone — Chrome):
1. Open Chrome and go to your Vercel URL
2. Tap the **three dots menu** (⋮) in the top right
3. Tap **"Add to Home screen"**
4. Give it a name (e.g. "Baby Tracker") and tap **Add**
5. It'll appear on your home screen like a normal app

### iPhone (your partner's phone — Safari):
> ⚠️ Must use Safari — Chrome on iPhone doesn't support this
1. Open **Safari** and go to the same Vercel URL
2. Tap the **Share button** (the box with an arrow pointing up, at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Give it a name and tap **Add**
5. It'll appear on the home screen like a normal app

---

## You're done! 🎉

Both phones now have the app on their home screen. Any entry logged on one phone
will appear on the other within a second or two, as long as you both have internet.

---

## Troubleshooting

**"Error connecting to database"**
→ Double-check that you copied the Supabase URL and anon key correctly in `src/supabase.js`

**The app isn't showing on the home screen**
→ On iPhone, make sure you're using Safari (not Chrome or Firefox)

**Entries aren't syncing between phones**
→ Check both phones have an internet connection
→ Make sure both phones are using the same URL

**You want to share the app with a family member**
→ Just send them the Vercel URL — they can add it to their home screen too

---

## Costs

Everything used in this guide is completely free:
- GitHub — free
- Supabase — free (up to 500MB storage and 2GB data transfer/month, which is plenty)
- Vercel — free (up to 100GB bandwidth/month)

The only thing that costs money is the AI Pattern Insights feature,
which uses the Anthropic API. For light personal use this will be
pennies per month (typically under $1).
