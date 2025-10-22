#!/usr/bin/env node
// Pequeno adaptador para executar o código escrito para Cloudflare Workers
// em um servidor Express local / dentro de um container Docker.
import express from "express";
import worker from "./index.js";
// Use as implementações nativas se disponíveis, caso contrário, importe do undici
let RequestClass = globalThis.Request;
let HeadersClass = globalThis.Headers;
if (!RequestClass || !HeadersClass) {
    const undici = await import("undici");
    RequestClass = undici.Request;
    HeadersClass = undici.Headers;
    if (!globalThis.fetch) {
        globalThis.fetch = undici.fetch;
    }
}
const app = express();
const port = process.env.PORT || 3000;
const adaptHeaders = (req) => {
    const headers = new HeadersClass();
    const reqHeaders = req.headers || {};
    Object.entries(reqHeaders).forEach(([k, v]) => {
        if (Array.isArray(v)) {
            v.forEach((val) => headers.append(k, val));
        }
        else if (v) {
            headers.set(k, String(v));
        }
    });
    return headers;
};
const handle = async (req, res) => {
    try {
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.get("host") || `localhost:${port}`;
        const url = `${protocol}://${host}${req.originalUrl}`;
        const headers = adaptHeaders(req);
        const request = new RequestClass(url, { method: req.method, headers });
        // chama o handler escrito para Cloudflare Workers
        const response = await worker.fetch(request, process.env);
        // propaga headers e status
        response.headers.forEach((value, key) => res.set(key, value));
        res.status(response.status);
        // envia corpo (pode ser vazio)
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
    }
    catch (err) {
        console.error("Error handling request:", err);
        res.status(500).send("Internal server error");
    }
};
// Rotas equivalentes às esperadas pelo handler Worker
app.get(["/auth", "/oauth/authorize", "/callback", "/oauth/redirect"], handle);
app.listen(port, () => console.log(`Auth server listening on http://localhost:${port}`));
