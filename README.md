# URL Shortener

A simple, minimalistic open-source URL shortener built with Node.js.

## Features

- Simple & minimal UI
- One-click copy to clipboard
- File-based persistence (JSON)
- Zero dependencies beyond Express

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | HTML / CSS / JS |
| Backend  | Node.js + Express |
| Storage  | JSON file |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

The shortener will be available at `http://localhost:3000`.

### 3. Use it

Paste any long URL → get a short link → share it.

## API

| Method | Endpoint | Description           |
|--------|----------|-----------------------|
| POST   | `/api/shorten` | `{"url": "..."}` → `{"shortUrl": "..."}` |
| GET    | `/:code` | Redirects to the original URL |
| GET    | `/api/info` | List all shortened URLs |

## Folder Structure

```
URLshort/
├── server.js           # Express server
├── urls.json           # Storage file (created on first use)
├── package.json
├── README.md
└── public/
    ├── index.html      # Frontend page
    ├── style.css       # Styling
    └── app.js          # Frontend logic
```

## License

MIT
