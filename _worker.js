const DATA_URL = "https://raw.githubusercontent.com/AladdSheneDev/RemDataJSON/main/remotes.json";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") || "").trim().toUpperCase();

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (!query) {
      return new Response(JSON.stringify({ success: false, message: "Missing query ?q=" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    try {
      const res = await fetch(DATA_URL);
      const data = await res.json();

      const matches = data.filter((item) =>
        [item.model, item.brand, item.remote_model, item.buy_link_name, item.buy_link_url]
          .filter(Boolean)
          .some((val) => val.toUpperCase().includes(query))
      );

      if (!matches.length) {
        return new Response(JSON.stringify({ success: false, message: `No match for "${query}"` }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      return new Response(JSON.stringify({ success: true, data: matches }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: "Failed to load JSON" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
