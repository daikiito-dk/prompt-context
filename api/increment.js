const { Redis } = require("@upstash/redis");

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const client = redis();
  if (!client) {
    res.status(503).json({ error: "redis_not_configured" });
    return;
  }

  var body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  var id = String((body && body.id) || "")
    .trim()
    .slice(0, 200);
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }

  try {
    const count = await client.hincrby("prompt_copy_scores", id, 1);
    res.status(200).json({ id: id, count: count });
  } catch (e) {
    res.status(500).json({ error: "increment_failed" });
  }
};
