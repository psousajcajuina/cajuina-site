#!/usr/bin/env node
// Pequeno adaptador para executar o código escrito para Cloudflare Workers
// em um servidor Express local / dentro de um container Docker.
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import worker from "./index.js";
import { env } from "./env.js";
// Configura logger
const logger = pino({
    level: env.LOG_LEVEL,
    transport: env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        }
        : undefined,
});
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
// Middleware de logging HTTP
app.use(pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 500 || err)
            return "error";
        if (res.statusCode >= 400)
            return "warn";
        if (res.statusCode >= 300)
            return "info";
        return "info";
    },
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
    },
}));
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
        const host = req.get("host") || `localhost:${env.PORT}`;
        const url = `${protocol}://${host}${req.originalUrl}`;
        req.log.debug({ url, method: req.method }, "Processing OAuth request");
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
        req.log.debug({ statusCode: response.status, size: buffer.length }, "Response sent");
        res.send(buffer);
    }
    catch (err) {
        req.log.error({ err }, "Error handling OAuth request");
        res.status(500).send("Internal server error");
    }
};
// Rotas equivalentes às esperadas pelo handler Worker
app.get(["/auth", "/oauth/authorize", "/callback", "/oauth/redirect"], handle);
app.get("/health", (req, res) => {
    const health = {
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        uptime: process.uptime(),
    };
    req.log.debug(health, "Health check");
    res.status(200).json(health);
});
app.listen(env.PORT, () => {
    const isLocal = env.HOST === "localhost" ||
        env.HOST.includes("127.0") ||
        env.HOST.includes("192.168");
    const protocol = isLocal || env.INSECURE_COOKIES === "1" ? "http" : "https";
    const serverUrl = `${protocol}://${env.HOST}:${env.PORT}`;
    logger.info({
        port: env.PORT,
        host: env.HOST,
        nodeEnv: env.NODE_ENV,
        logLevel: env.LOG_LEVEL,
    }, `Auth server listening on ${serverUrl}`);
});
