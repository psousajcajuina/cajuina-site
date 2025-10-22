#!/usr/bin/env node
// Pequeno adaptador para executar o código escrito para Cloudflare Workers
// em um servidor Express local / dentro de um container Docker.

import express from "express";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import type { IncomingHttpHeaders } from "http";
import worker from "./index.js";

// Use as implementações nativas se disponíveis, caso contrário, importe do undici
let RequestClass = globalThis.Request as any;
let HeadersClass = (globalThis as any).Headers;

if (!RequestClass || !HeadersClass) {
  const undici = await import("undici");
  RequestClass = undici.Request;
  HeadersClass = undici.Headers;
  if (!globalThis.fetch) {
    (globalThis as any).fetch = undici.fetch;
  }
}

const app = express();
const port = process.env.PORT || 3000;

const adaptHeaders = (req: ExpressRequest): Headers => {
  const headers = new HeadersClass();
  const reqHeaders: IncomingHttpHeaders = req.headers || {};

  Object.entries(reqHeaders).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((val) => headers.append(k, val));
    } else if (v) {
      headers.set(k, String(v));
    }
  });

  return headers;
};

const handle = async (
  req: ExpressRequest,
  res: ExpressResponse
): Promise<void> => {
  try {
    const protocol =
      (req.headers["x-forwarded-proto"] as string) || req.protocol;
    const host = req.get("host") || `localhost:${port}`;
    const url = `${protocol}://${host}${req.originalUrl}`;

    const headers = adaptHeaders(req);
    const request = new RequestClass(url, { method: req.method, headers });

    // chama o handler escrito para Cloudflare Workers
    const response = await worker.fetch(
      request,
      process.env as Record<string, string>
    );

    // propaga headers e status
    response.headers.forEach((value, key) => res.set(key, value));
    res.status(response.status);

    // envia corpo (pode ser vazio)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).send("Internal server error");
  }
};

// Rotas equivalentes às esperadas pelo handler Worker
app.get(["/auth", "/oauth/authorize", "/callback", "/oauth/redirect"], handle);

app.get("/health", (_req: any, res: any) => {
  res.status(200).send({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.listen(port, () =>
  console.log(`Auth server listening on http://localhost:${port}`)
);
