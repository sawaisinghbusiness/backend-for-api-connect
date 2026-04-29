import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const API_URL = "https://apnasmm.com/api/v2";
const API_KEY = process.env.API_KEY;

app.get("/ping", (req, res) => res.json({ ok: true }));

app.post("/order", async (req, res) => {
  const { service, link, quantity } = req.body;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        key: API_KEY,
        action: "add",
        service,
        link,
        quantity
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));
