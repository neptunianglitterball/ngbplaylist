# Who Are You After Midnight? — Italo Disco Archetype Quiz

A personality quiz that reveals your Italo Disco archetype through 5 evocative questions, then generates a personalized 13-track playlist. **Create the playlist directly in your Spotify account** with one click.

## Run the app

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (e.g. **http://127.0.0.1:5173**). Use that exact URL so the Spotify redirect works.

## Create playlists in Spotify

Spotify no longer accepts `localhost` redirect URIs. Use the loopback URL above and this Redirect URI in the Dashboard.

To enable the "Create in Spotify" feature:

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard) and log in
2. Create an app (or use an existing one)
3. In your app settings, add these **Redirect URIs** (so either port works): `http://127.0.0.1:5173/` and `http://127.0.0.1:5174/`
4. Copy your **Client ID**
5. Create a `.env` file in the project root (no quotes around the value):
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   ```
6. Restart the dev server

When you complete the quiz, click **CREATE IN SPOTIFY** to log in with your Spotify account and add the playlist to your library.

**If you see "This page is not working" or "invalid response" from accounts.spotify.com:**

- Open the app at **http://127.0.0.1:5173** (not `localhost`).
- In the Spotify Dashboard, the Redirect URI must be exactly **`http://127.0.0.1:5173/`** (with the trailing slash). Remove any `http://localhost:5173` entry.
- In `.env`, use `VITE_SPOTIFY_CLIENT_ID=your_actual_id` with no spaces or quotes around the value.

**If Safari (or any browser) says "Can't Connect to the Server" when returning from Spotify:**

- **Use the same device and browser** where the app is running. If you authorized on a phone or another computer, the redirect goes to *that* device’s 127.0.0.1, where no server is running.
- **Keep the dev server running** (`npm run dev`) before you click "Create in Spotify" and leave it running until after Spotify redirects back.
- **Open the app at http://127.0.0.1:5173** in the same browser tab/window (or at least the same browser). Start the quiz there, click "Create in Spotify", sign in on Spotify, and let it redirect back—don’t open the redirect URL on another device.

## Build for production

```bash
npm run build
```

For production, add your deployment URL (e.g. `https://yoursite.com/`) to your Spotify app's Redirect URIs.

---

## Deploy publicly (step-by-step)

Follow these steps so anyone can use the app on the web and create playlists in their Spotify account.

### 1. Spotify Dashboard — prepare your app

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard) and log in.
2. Open your app (or create one).
3. You will add the **production** Redirect URI in step 6, after you know your live URL. Keep the Dashboard tab open.

### 2. Put the code in a Git repo (if needed)

If the project is not in Git yet:

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on [GitHub](https://github.com/new) (public or private), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Choose a host and connect the repo

Use one of these (free tier is enough):

**Option A — Vercel (recommended)**

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. Import your GitHub repo. If you don’t see it, connect GitHub and grant access to the repo.
4. **Framework Preset:** Vite (Vercel usually detects it).
5. **Root Directory:** leave default.
6. Under **Environment Variables**, add:
   - **Name:** `VITE_SPOTIFY_CLIENT_ID`
   - **Value:** your Spotify app **Client ID** (from the Spotify Dashboard).
7. Click **Deploy**. Wait for the build to finish.
8. Your app will be at a URL like `https://your-project.vercel.app`. Copy that URL (with a trailing slash for the next step: `https://your-project.vercel.app/`).

**Option B — Netlify**

1. Go to [netlify.com](https://www.netlify.com) and sign in (e.g. with GitHub).
2. **Add new site** → **Import an existing project** → **GitHub** and select your repo.
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. **Environment variables** → **Add a variable** → **Key:** `VITE_SPOTIFY_CLIENT_ID`, **Value:** your Spotify Client ID.
6. Deploy. Your site will be at `https://something.netlify.app`. Copy that URL with a trailing slash: `https://something.netlify.app/`.

### 4. Add the production Redirect URI in Spotify

1. In the [Spotify Dashboard](https://developer.spotify.com/dashboard), open your app → **Settings**.
2. Under **Redirect URIs**, click **Add** and paste your **exact** live URL with trailing slash, e.g. `https://your-project.vercel.app/`.
3. Click **Save** (or **Add** then **Save**).

### 5. Test the live app

1. Open your live URL in the browser.
2. Do the quiz and click **CREATE IN SPOTIFY**.
3. Log in with Spotify when asked. You should be redirected back to your site and the playlist should be created.

If you see “invalid redirect URI” or the redirect fails, double-check that the Redirect URI in the Dashboard matches the site URL **exactly** (including `https://` and the trailing `/`).

### 6. (Optional) Custom domain

- **Vercel:** Project → **Settings** → **Domains** → add your domain and follow the DNS instructions.
- **Netlify:** Site → **Domain management** → **Add custom domain**.

After adding a custom domain, add **that** URL as another Redirect URI in the Spotify Dashboard (e.g. `https://yourdomain.com/`) and save.
