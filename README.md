This weather app is designed to check weather for any city in any country.

This PR fixes duplicate event listeners, fragile city select population, missing error handling, and a hard-coded API key.

## Setup / API key

Edit `/home/runner/work/Check-Whether-Now/Check-Whether-Now/script.js` and set:

```js
const WEATHER_API_KEY = "YOUR_KEY";
```

> Note: putting API keys in client-side JavaScript exposes them publicly. For safer usage, prefer a small server-side proxy or serverless function.

Minimal Node/Express proxy example:

```js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.get('/weather', async (req, res) => {
  const q = req.query.q; // city,country
  const key = process.env.WEATHER_API_KEY;
  const r = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(q)}`);
  const json = await r.json();
  res.json(json);
});
app.listen(3000);
```

## Local test / deploy

- Run a local static server:
  - `python3 -m http.server 8000`
  - or `npx http-server -p 8000`
- Open `http://localhost:8000/index.html`.
- For GitHub Pages: push to `main` and enable Pages in repository settings.
