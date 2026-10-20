#!/usr/bin/env node
/**
 * Extracts the Telecel wordmark (with transparency) from the RFQ PDF into
 * public/brand/telecel-wordmark.png. Both paths are git-ignored: the artwork
 * is confidential until Telecel approves publishing (and the repo is public).
 *
 * Usage: npm run brand:extract -- [path/to/rfq.pdf]
 * Default: the first *.pdf in docs/client/ whose name contains "RFQ".
 * Replace with the official SVG from the brand pack when it arrives.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();
const clientDir = path.join(root, "docs", "client");
const input =
  process.argv[2] ??
  path.join(
    clientDir,
    readdirSync(clientDir).find((name) => /rfq/i.test(name) && name.endsWith(".pdf")) ?? ""
  );
const output = path.join(root, "public", "brand", "telecel-wordmark.png");

const bytes = readFileSync(input);
const text = bytes.toString("latin1");
const objects = new Map();
const pattern = /(\d+) 0 obj\s*<<([\s\S]*?)>>\s*stream\r?\n/g;
for (let match; (match = pattern.exec(text)); ) {
  const start = match.index + match[0].length;
  const length = Number(match[2].match(/\/Length (\d+)/)?.[1] ?? 0);
  objects.set(match[1], { dict: match[2], data: bytes.subarray(start, start + length) });
}

// The wordmark is the only wide (≈3:1) RGB image with an alpha mask.
const candidate = [...objects.entries()].find(([, { dict }]) => {
  if (!/\/Subtype\s*\/Image/.test(dict) || !/\/SMask \d+/.test(dict)) return false;
  const width = Number(dict.match(/\/Width (\d+)/)?.[1]);
  const height = Number(dict.match(/\/Height (\d+)/)?.[1]);
  return width / height > 2.5 && /DeviceRGB/.test(dict) && /FlateDecode/.test(dict);
});
if (!candidate) throw new Error(`No wordmark image found in ${input}`);

const [, { dict, data }] = candidate;
const width = Number(dict.match(/\/Width (\d+)/)[1]);
const height = Number(dict.match(/\/Height (\d+)/)[1]);
const rgb = zlib.inflateSync(data);
const alpha = zlib.inflateSync(objects.get(dict.match(/\/SMask (\d+)/)[1]).data);

const rows = [];
for (let y = 0; y < height; y += 1) {
  const row = Buffer.alloc(1 + width * 4);
  for (let x = 0; x < width; x += 1) {
    const i = y * width + x;
    row.set([rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2], alpha[i]], 1 + x * 4);
  }
  rows.push(row);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k += 1) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, body) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(body.length);
  const typed = Buffer.concat([Buffer.from(type), body]);
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(typed));
  return Buffer.concat([head, typed, tail]);
}
const header = Buffer.alloc(13);
header.writeUInt32BE(width, 0);
header.writeUInt32BE(height, 4);
header.set([8, 6, 0, 0, 0], 8);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(
  output,
  Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ])
);
console.log(`Wrote ${path.relative(root, output)} (${width}×${height}). Restart next dev/build.`);
