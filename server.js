const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "urls.json");

app.use(express.json());

let urls = loadUrls();

function loadUrls() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveUrls() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));
}

function generateCode() {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += charset[crypto.randomInt(charset.length)];
  }
  return code;
}

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Simple validation
  let targetUrl = url;
  if (!/^https?:\/\//i.test(url)) {
    targetUrl = "https://" + url;
  }

  try {
    new URL(targetUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  let shortCode = generateCode();

  while (urls[shortCode]) {
    shortCode = generateCode();
  }

  urls[shortCode] = targetUrl;
  saveUrls();

  const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
  res.json({ shortUrl, code: shortCode, target: targetUrl });
});

// GET: Redirect to original URL
app.get("/:code", (req, res) => {
  const code = req.params.code;

  if (urls[code]) {
    return res.redirect(urls[code]);
  }

  res.status(404).json({ error: "Short URL not found" });
});

app.get("/api/info", (req, res) => {
  const stats = { total: Object.keys(urls).length, urls: {} };
  for (const [code, target] of Object.entries(urls)) {
    stats.urls[code] = target;
  }
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`URL Shortener running at http://localhost:${PORT}`);
});
