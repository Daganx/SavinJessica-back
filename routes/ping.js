app.get("api/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
  });
  