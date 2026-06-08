// Backend API base URL.
//
// - When the app is served by its own Node server (local dev or a Node host),
//   API_BASE stays empty so requests go to the same origin.
// - When the front-end is served from GitHub Pages (tejaskor.github.io), the
//   backend lives elsewhere, so point API_BASE at your deployed Node server.
//
// 👉 Replace the URL below with your real backend URL after you deploy it
//    (e.g. the Render/Railway URL from the Docker deployment).
window.API_BASE = location.hostname.endsWith('github.io')
  ? 'https://webaudit.onrender.com'
  : '';
