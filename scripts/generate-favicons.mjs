import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// 1. SVG Favicon Content (512x512)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4FF55"/>
      <stop offset="50%" stop-color="#C8FF3D"/>
      <stop offset="100%" stop-color="#AEE61B"/>
    </linearGradient>
    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#C8FF3D" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Outer Dark Athletic Squircle Base -->
  <rect x="20" y="20" width="472" height="472" rx="136" fill="#111315" stroke="#C8FF3D" stroke-width="12" stroke-opacity="0.4" />

  <!-- Inner Vibrant Lime Disc -->
  <circle cx="256" cy="256" r="190" fill="url(#limeGrad)" filter="url(#badgeShadow)" />

  <!-- Barbell Weight Plates Left -->
  <rect x="88" y="206" width="22" height="100" rx="8" fill="#111315" />
  <rect x="116" y="222" width="14" height="68" rx="5" fill="#111315" />

  <!-- Barbell Weight Plates Right -->
  <rect x="402" y="206" width="22" height="100" rx="8" fill="#111315" />
  <rect x="382" y="222" width="14" height="68" rx="5" fill="#111315" />

  <!-- Dynamic Athletic Pulse Wave (ECG Activity Spike) -->
  <path d="M128 256 h54 l34 94 56 -216 48 162 30 -40 h66"
        fill="none"
        stroke="#111315"
        stroke-width="34"
        stroke-linecap="round"
        stroke-linejoin="round" />
</svg>`;

// Helper function to calculate CRC32 for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

// Distance from point (px, py) to line segment (x1, y1)-(x2, y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function generatePng(size) {
  const width = size;
  const height = size;
  const scale = size / 64;

  const rawRows = [];
  const cx = width / 2;
  const cy = height / 2;
  const r = (size * 0.45);

  // Line segments in 64-grid space
  const segs = [
    [13, 32, 21, 32],
    [21, 32, 26, 46],
    [26, 46, 33, 16],
    [33, 16, 40, 40],
    [40, 40, 44, 32],
    [44, 32, 51, 32],
  ].map(s => s.map(v => v * scale));

  const strokeWidth = 3.8 * scale;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const offset = 1 + x * 4;
      const dCenter = Math.hypot(x - cx, y - cy);

      if (dCenter <= r) {
        // Base color: Neon Lime #C8FF3D (200, 255, 61)
        let red = 200;
        let green = 255;
        let blue = 61;
        let alpha = 255;

        // Anti-aliasing edge
        if (dCenter > r - 1.2) {
          alpha = Math.round(255 * (r - dCenter) / 1.2);
          alpha = Math.max(0, Math.min(255, alpha));
        }

        // Check barbell plates
        const gx = x / scale;
        const gy = y / scale;

        const inLeftPlate1 = (gx >= 9 && gx <= 12 && gy >= 23 && gy <= 41);
        const inLeftPlate2 = (gx >= 13 && gx <= 15 && gy >= 26 && gy <= 38);
        const inRightPlate1 = (gx >= 52 && gx <= 55 && gy >= 23 && gy <= 41);
        const inRightPlate2 = (gx >= 49 && gx <= 51 && gy >= 26 && gy <= 38);

        // Check distance to pulse segments
        let minDist = Infinity;
        for (const [x1, y1, x2, y2] of segs) {
          const d = distToSegment(x, y, x1, y1, x2, y2);
          if (d < minDist) minDist = d;
        }

        if (inLeftPlate1 || inLeftPlate2 || inRightPlate1 || inRightPlate2 || minDist <= strokeWidth / 2) {
          // Dark Carbon #111315
          red = 17;
          green = 19;
          blue = 21;
        }

        row[offset] = red;
        row[offset + 1] = green;
        row[offset + 2] = blue;
        row[offset + 3] = alpha;
      } else {
        // Transparent
        row[offset] = 0;
        row[offset + 1] = 0;
        row[offset + 2] = 0;
        row[offset + 3] = 0;
      }
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function createIcoFromPng(pngBuffer, size = 32) {
  // ICO Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(1, 4); // count of images

  // Directory Entry: 16 bytes
  const dir = Buffer.alloc(16);
  dir[0] = size >= 256 ? 0 : size; // width
  dir[1] = size >= 256 ? 0 : size; // height
  dir[2] = 0; // palette size
  dir[3] = 0; // reserved
  dir.writeUInt16LE(1, 4); // color planes
  dir.writeUInt16LE(32, 6); // bits per pixel
  dir.writeUInt32BE(pngBuffer.length, 8); // size of image data in bytes (LE)
  dir.writeUInt32LE(pngBuffer.length, 8);
  dir.writeUInt32LE(6 + 16, 12); // offset of image data

  return Buffer.concat([header, dir, pngBuffer]);
}

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const appDir = path.join(rootDir, 'src', 'app');

// 1. Write SVG icons
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent, 'utf8');
console.log('✓ Created public/icon.svg and src/app/icon.svg');

// 2. Generate 32x32 PNG & ICO
const png32 = generatePng(32);
const ico = createIcoFromPng(png32, 32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), ico);
console.log('✓ Created public/favicon.ico and src/app/favicon.ico');

// 3. Generate 192x192 Apple Touch Icon
const png192 = generatePng(192);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png192);
fs.writeFileSync(path.join(appDir, 'apple-icon.png'), png192);
console.log('✓ Created public/apple-touch-icon.png and src/app/apple-icon.png');
