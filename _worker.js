addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const DATA_URL = 'https://raw.githubusercontent.com/AladdSheneDev/RemDataJSON/main/remotes.json';

async function handleRequest(request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim().toUpperCase();

  if (!query) {
    return new Response(JSON.stringify({ success: false, message: 'Missing query parameter ?q=' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let data;
  try {
    const res = await fetch(DATA_URL);
    data = await res.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: 'Failed to load remote data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = data.filter(item =>
    (item.model && item.model.toUpperCase().includes(query)) ||
    (item.brand && item.brand.toUpperCase().includes(query)) ||
    (item.remote_model && item.remote_model.toUpperCase().includes(query)) ||
    (item.buy_link_name && item.buy_link_name.toUpperCase().includes(query)) ||
    (item.buy_link_url && item.buy_link_url.toUpperCase().includes(query))
  );

  if (results.length === 0) {
    return new Response(JSON.stringify({ success: false, message: 'No remotes found matching "' + query + '"' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, data: results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
