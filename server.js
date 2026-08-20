const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const API_URL = "https://wholesalesmmstore.com/api/v2";
const API_KEY = process.env.API_KEY;

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.post("/order", async (req, res) => {
  const { service, link, quantity, runs, interval, comments } = req.body;
  try {
    const params = {
      key: API_KEY,
      action: "add",
      service,
      link,
      quantity,
    };

    // Support Drip Feed parameters (runs & interval)
    const parsedRuns = parseInt(runs);
    const parsedInterval = parseInt(interval);
    if (!isNaN(parsedRuns) && parsedRuns > 0 && !isNaN(parsedInterval) && parsedInterval > 0) {
      params.runs = parsedRuns;
      params.interval = parsedInterval;
    }

    // Support Custom Comments if provided
    if (comments) {
      params.comments = comments;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/refill", async (req, res) => {
  const { order } = req.body;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key: API_KEY,
        action: "refill",
        order: order || req.body.orderId,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/cancel", async (req, res) => {
  const { order } = req.body;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key: API_KEY,
        action: "cancel",
        orders: order || req.body.orderId,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
app.get("/status/:orderId", async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key: API_KEY,
        action: "status",
        order: req.params.orderId,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  const SELF_URL = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/`
    : `http://localhost:${PORT}/`;
  setInterval(() => {
    fetch(SELF_URL).catch(() => {});
  }, 4 * 60 * 1000);
});
