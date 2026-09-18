import app from '../server/app.js';

export default function handler(req, res) {
  // Normalize incoming URL to ensure /api prefix is present for Express route matching
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return app(req, res);
}
