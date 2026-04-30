addEventListener("fetch", (event) => {
    event.respondWith(handle(event.request));
  });
  async function handle(request) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (p === "/api/contact" || p === "/api/newsletter") {
      return fetch("https://abrilove-oto-worker.sofiane-daboussi.workers.dev" + p, {
        method: request.method,
        headers: { "Content-Type": "application/json", "Origin": "https://abrilove.fr" },
        body: request.body
      });
    }
    if (p.startsWith("/accro") || p === "/reveuse" || p.startsWith("/reveuse/") || p === "/cerebrale" || p.startsWith("/cerebrale/") || p === "/louve" || p.startsWith("/louve/") || p.startsWith("/quiz-gratuit") || p === "/contact" || p.startsWith("/contact/") || p.startsWith("/_next") || p.startsWith("/images") || p === "/favicon.ico" || p === "/favicon-v2.ico") {
      return fetch("https://abrilove-oto.pages.dev" + p + url.search, { redirect: "follow" });
    }
    return fetch("https://abri-love.webflow.io" + p + url.search, {
      method: request.method,
      headers: { ...Object.fromEntries(request.headers), host: "abrilove.fr" }
    });
  }
  __name(handle, "handle");
})();
//# sourceMappingURL=worker.js.map

