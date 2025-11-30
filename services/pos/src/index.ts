import app from "./app";

const PORT = Number(process.env.POS_PORT) || 4002;

app.listen(PORT, () => {
  console.log(`POS service listening on http://localhost:${PORT}`);
});
