/**
 * Spotify Web API integration for playlist creation.
 * Uses Authorization Code with PKCE flow (no backend required).
 */

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SCOPES = 'playlist-modify-public playlist-modify-private';
const CODE_VERIFIER_KEY = 'spotify_code_verifier';
const ACCESS_TOKEN_KEY = 'spotify_access_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';

// Client ID from .env — trim and strip quotes so "abc" or 'abc' still works
const getClientId = () => {
  const raw = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  if (raw == null || typeof raw !== 'string') return '';
  return raw.trim().replace(/^["']|["']$/g, '');
};

export function getRedirectUri() {
  if (typeof window !== 'undefined') {
    // Spotify no longer accepts localhost/0.0.0.0; use loopback 127.0.0.1 so Dashboard allows the URI
    const origin = window.location.origin.replace(/\/$/, '');
    const url = new URL(origin);
    if (url.hostname === 'localhost' || url.hostname === '0.0.0.0') {
      url.hostname = '127.0.0.1';
    }
    // Single trailing slash, no path (e.g. http://127.0.0.1:5173/)
    return `${url.origin}/`;
  }
  return 'http://127.0.0.1:5173/';
}

export function isRedirectUriSafeForSpotify() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return host === '127.0.0.1' || host === 'localhost' || protocol === 'https:';
}

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

function isSecureContext() {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}

async function sha256(plain) {
  if (!isSecureContext()) {
    throw new Error(
      'Spotify login requires a secure connection (HTTPS or localhost). ' +
      'Open this app at https://… or on your computer at http://127.0.0.1 to create playlists.'
    );
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function generatePKCE() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);
  return { codeVerifier, codeChallenge };
}

export function redirectToSpotifyAuth() {
  const clientId = getClientId();
  if (!clientId) {
    throw new Error('VITE_SPOTIFY_CLIENT_ID is not set. Create a .env file with your Spotify app Client ID.');
  }
  if (!isSecureContext()) {
    throw new Error(
      'Spotify login requires a secure connection (HTTPS or localhost). ' +
      'Open this app at https://… or on your computer at http://127.0.0.1 to create playlists.'
    );
  }
  if (!isRedirectUriSafeForSpotify()) {
    throw new Error(
      'Create in Spotify requires a secure page (HTTPS or http://127.0.0.1). You are on ' + window.location.origin + '.'
    );
  }

  return (async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: SCOPES,
      redirect_uri: getRedirectUri(),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state: generateRandomString(16),
    });

    window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  })();
}

export async function exchangeCodeForToken(code) {
  const clientId = getClientId();
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

  if (!clientId || !codeVerifier) {
    throw new Error('Missing client ID or code verifier');
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: codeVerifier,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Token exchange failed');
  }

  localStorage.removeItem(CODE_VERIFIER_KEY);
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
  return data.access_token;
}

export function getStoredToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearStoredToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  const clientId = getClientId();
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!clientId || !refreshToken) {
    throw new Error('Cannot refresh: missing client ID or refresh token');
  }
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Token refresh failed');
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
  return data.access_token;
}

async function spotifyFetch(endpoint, options = {}) {
  let token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated with Spotify');
  }
  const doFetch = (t) => {
    const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`;
    return fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${t}`,
        ...options.headers,
      },
    });
  };
  let res = await doFetch(token);
  if (res.status === 401) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        token = await refreshAccessToken();
        res = await doFetch(token);
      } catch (e) {
        clearStoredToken();
        throw new Error('Session expired. Click “Create in Spotify” to sign in again.');
      }
    } else {
      clearStoredToken();
      throw new Error('Session expired. Click “Create in Spotify” to sign in again.');
    }
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error?.message || err.error_description || `Spotify API error: ${res.status}`;
    if (res.status === 401) {
      clearStoredToken();
      throw new Error('Session expired. Click “Create in Spotify” to sign in again.');
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function getCurrentUser() {
  return spotifyFetch('/me');
}

/**
 * Build a Spotify search query. Use quotes for multi-word values so
 * "Alexander Robotnick" and "Problèmes d'amour" are searched correctly.
 */
function buildSearchQuery(artist, title) {
  const escape = (s) => String(s).replace(/"/g, '\\"').trim();
  return `track:"${escape(title)}" artist:"${escape(artist)}"`;
}

/**
 * Find best matching track from results. Prefer exact artist/title match.
 */
function pickBestMatch(items, artist, title) {
  if (!items?.length) return null;
  const artistLower = artist.toLowerCase();
  const titleLower = title.toLowerCase();
  for (const item of items) {
    const itemArtist = (item.artists?.[0]?.name || '').toLowerCase();
    const itemTitle = (item.name || '').toLowerCase();
    if (itemArtist.includes(artistLower) || artistLower.includes(itemArtist)) {
      if (itemTitle.includes(titleLower) || titleLower.includes(itemTitle)) {
        return item.uri;
      }
    }
  }
  return items[0].uri;
}

export async function searchTrack(artist, title) {
  // Try quoted search first (best for multi-word artist/title)
  let q = buildSearchQuery(artist, title);
  let data = await spotifyFetch(`/search?q=${encodeURIComponent(q)}&type=track&limit=5`);
  let tracks = data.tracks?.items;
  let uri = pickBestMatch(tracks, artist, title);

  // Fallback: simple keyword search if quoted search fails (Spotify may not support quotes)
  if (!uri && tracks?.length === 0) {
    q = `${title} ${artist}`.trim();
    data = await spotifyFetch(`/search?q=${encodeURIComponent(q)}&type=track&limit=5`);
    tracks = data.tracks?.items;
    uri = pickBestMatch(tracks, artist, title);
  }

  return uri;
}

export async function createPlaylist(userId, name, description) {
  return spotifyFetch(`/users/${userId}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description: description || '',
      public: true,
    }),
  });
}

export async function addTracksToPlaylist(playlistId, trackUris) {
  return spotifyFetch(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: trackUris }),
  });
}

export async function createPlaylistFromTracks(tracks, playlistName, playlistDescription) {
  const user = await getCurrentUser();
  const trackUris = [];

  for (const track of tracks) {
    const uri = await searchTrack(track.artist, track.title);
    if (uri) trackUris.push(uri);
  }

  if (trackUris.length === 0) {
    throw new Error('No tracks were found on Spotify. Some Italo classics may not be available.');
  }

  const playlist = await createPlaylist(user.id, playlistName, playlistDescription);

  // Spotify allows max 100 tracks per request
  await addTracksToPlaylist(playlist.id, trackUris);

  return {
    id: playlist.id,
    url: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${playlist.id}`,
    tracksAdded: trackUris.length,
    tracksSkipped: tracks.length - trackUris.length,
  };
}
