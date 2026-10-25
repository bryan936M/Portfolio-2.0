import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const portIndex = process.argv.indexOf("--port");
const port = Number(
  process.env.PORT || (portIndex >= 0 ? process.argv[portIndex + 1] : 3010),
);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Provide a valid port from 1 to 65535.");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".xml": "application/xml",
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    let info = await stat(file);
    if (info.isDirectory()) {
      file = resolve(file, "index.html");
      info = await stat(file);
    }
    if (!info.isFile()) throw new Error("Not found");
    response.writeHead(200, {
      "Content-Type": `${mime[extname(file)] || "application/octet-stream"}; charset=utf-8`,
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(resolve(root, "404.html")).pipe(response);
  }
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}/`));
