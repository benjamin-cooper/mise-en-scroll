#!/usr/bin/env node
// Generates public/icons/icon-192.png and icon-512.png
// Run once: node generate-icons.js
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

function crc32(buf) {
  if (!crc32.t) {
    crc32.t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      crc32.t[i] = c;
    }
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = crc32.t[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function setPixel(rows, size, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const i = x * 4;
  rows[y][i] = r; rows[y][i+1] = g; rows[y][i+2] = b; rows[y][i+3] = a;
}

function makePNG(size) {
  const R = Math.floor(size * 0.23); // corner radius
  const rows = Array.from({ length: size }, () => Buffer.alloc(size * 4));

  // Orange rounded-rect background (#c75b2e = 199,91,46)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.max(0, Math.max(R - x, x - (size - R - 1)));
      const cy = Math.max(0, Math.max(R - y, y - (size - R - 1)));
      if (Math.sqrt(cx*cx + cy*cy) > R) continue; // transparent corner
      const i = x * 4;
      rows[y][i] = 199; rows[y][i+1] = 91; rows[y][i+2] = 46; rows[y][i+3] = 255;
    }
  }

  // White fork icon (centered, occupies ~50% height)
  const tw  = Math.max(3, Math.round(size * 0.045)); // tine width
  const th  = Math.round(size * 0.22);               // tine height
  const ty  = Math.round(size * 0.18);               // tine top
  const gap = Math.max(2, Math.round(size * 0.042)); // gap between tines
  const fw  = tw * 3 + gap * 2;                      // total fork width
  const fx  = Math.floor((size - fw) / 2);           // fork left edge
  const cbH = Math.max(2, Math.round(size * 0.03));  // crossbar height
  const cbY = ty + th;                               // crossbar top
  const hw  = Math.max(3, Math.round(size * 0.055)); // handle width
  const hx  = Math.floor((size - hw) / 2);           // handle left
  const hBot = Math.round(size * 0.82);              // handle bottom

  // 3 tines
  for (let t = 0; t < 3; t++) {
    const lx = fx + t * (tw + gap);
    for (let y = ty; y < ty + th; y++)
      for (let x = lx; x < lx + tw; x++)
        setPixel(rows, size, x, y, 255, 255, 255);
  }
  // Crossbar
  for (let y = cbY; y < cbY + cbH; y++)
    for (let x = fx; x < fx + fw; x++)
      setPixel(rows, size, x, y, 255, 255, 255);
  // Handle
  for (let y = cbY + cbH; y < hBot; y++)
    for (let x = hx; x < hx + hw; x++)
      setPixel(rows, size, x, y, 255, 255, 255);

  // Build PNG
  const raw = Buffer.concat(rows.map(r => Buffer.concat([Buffer.from([0]), r])));
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, 'public', 'icons');
for (const size of [192, 512]) {
  const png = makePNG(size);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
  console.log(`icon-${size}.png  (${png.length} bytes)`);
}
