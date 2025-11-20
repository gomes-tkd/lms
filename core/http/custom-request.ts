import type { IncomingMessage } from "http";

export interface CustomRequest extends IncomingMessage {
  query: URLSearchParams;
  pathname: string;
  body: Record<string, any>;
}

export async function customRequest(request: IncomingMessage) {
  const req = request as CustomRequest;
  const url = new URL(req.url || "", "http://localhost");
  req.query = url.searchParams;
  req.pathname = url.pathname;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");

  if (request.headers["content-type"] === "application/json") {
    try {
      req.body = JSON.parse(body);
    } catch {
      req.body = {};
    }
  } else {
    req.body = {};
  }

  return req;
}