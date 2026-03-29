const { Redis } = require("@upstash/redis");

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function redis() {
  try {
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const client = redis();
  if (!client) {
    res.status(503).json({ error: "redis_not_configured", scores: {} });
    return;
  }

  try {
    const raw = await client.hgetall("prompt_copy_scores");
    const scores = {};
    if (raw && typeof raw === "object") {
      Object.keys(raw).forEach(function (k) {
        const n = parseInt(String(raw[k]), 10);
        if (!isNaN(n) && n >= 0) scores[k] = n;
      });
    }
    res.status(200).json({ scores: scores });
  } catch (e) {
    res.status(500).json({ error: "fetch_failed", scores: {} });
  }
};
