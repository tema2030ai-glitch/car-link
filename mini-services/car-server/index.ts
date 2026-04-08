import { serve } from "bun";

// Simple health check server
serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Forward to Next.js
    try {
      const nextResponse = await fetch(`http://127.0.0.1:3001${url.pathname}${url.search}`, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
      return nextResponse;
    } catch (e) {
      return new Response("Next.js not running", { status: 503 });
    }
  },
});

console.log("Proxy server running on port 3000");
