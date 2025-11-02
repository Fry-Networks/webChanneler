import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
const port = 3000; // change to your desired port

const server = express();
server.use(helmet());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicFolderPath = path.resolve(
  __dirname,
  "../phpServer/frycrypto-main/public"
);
server.use(express.static(publicFolderPath));
server.use((req, res, next) => {
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(req.hostname)) {
    res.status(403).send("Direct access is not allowed");
    return;
  }

  if (req.hostname === "dashboard.frynetworks.com") {
    req.url = "/dashboard" + req.url;
  } else if (req.hostname === "byod.frynetworks.com") {
    req.url = "/byod" + req.url;
  } else if (req.hostname === "admin.frynetworks.com") {
    req.url = "/admin" + req.url;
  } else if (req.hostname === "vote.frynetworks.com") {
    req.url = "/vote" + req.url;
  } else if (req.hostname === "explorer.frynetworks.com") {
    req.url = "/explorer" + req.url;
  } else if (req.hostname === "tiles.frynetworks.com") {
    req.url = "/tiles" + req.url;
  } else {
    console.log(`Unknown host ${req.hostname}`);
    res.status(403).send("Unknown host");
    return;
  }

  console.log(`channeled ${req.hostname} to ${req.url}`);
  next();
});

server.use(
  "/byod",
  createProxyMiddleware({ target: "http://localhost:3001", changeOrigin: true })
);
server.use(
  "/dashboard",
  createProxyMiddleware({ target: "http://localhost:3007", changeOrigin: true })
);
server.use(
  "/admin",
  createProxyMiddleware({ target: "http://localhost:3008", changeOrigin: true })
);
server.use(
  "/vote",
  createProxyMiddleware({ target: "http://localhost:3012", changeOrigin: true })
);
server.use(
  "/explorer",
  createProxyMiddleware({ target: "http://localhost:3019", changeOrigin: true })
);
server.use(
  "/tiles",
  createProxyMiddleware({ target: "http://localhost:3018", changeOrigin: true })
);

server.listen(port, (err?: unknown) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
