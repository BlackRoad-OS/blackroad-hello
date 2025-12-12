/**
 * Cloudflare Worker Entry Point
 * Handles requests at the edge with security headers and routing
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Security headers applied to all responses
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'",
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Health check endpoint
    if (url.pathname === '/health' || url.pathname === '/healthz') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json', ...securityHeaders },
      });
    }

    // API routes (example structure)
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env, url);
    }

    // Serve static HTML for all other routes (SPA support)
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlackRoad OS</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #fff;
        }
        .container { text-align: center; padding: 2rem; }
        .logo {
            font-size: 4rem;
            font-weight: 800;
            background: linear-gradient(90deg, #FF9D00, #FF6B00, #FF0066, #FF006B, #D600AA, #7700FF, #0066FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            animation: glow 3s ease-in-out infinite;
        }
        @keyframes glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.2); } }
        .tagline { font-size: 1.25rem; color: #888; margin-bottom: 2rem; }
        .status {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 2rem;
            font-size: 0.875rem;
            color: #FF9D00;
        }
        .pulse {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #FF9D00;
            border-radius: 50%;
            margin-right: 0.5rem;
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="logo">BlackRoad OS</h1>
        <p class="tagline">Edge-powered infrastructure</p>
        <div class="status"><span class="pulse"></span>Running on Cloudflare</div>
    </div>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8', ...securityHeaders },
    });
  },
};

async function handleAPI(request, env, url) {
  const path = url.pathname.replace('/api', '');

  // API version info
  if (path === '/version' || path === '/v1/version') {
    return new Response(JSON.stringify({
      version: '1.0.0',
      platform: 'cloudflare-workers',
      environment: env.ENVIRONMENT || 'production',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 404 for unknown API routes
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
