// Erzeugt einfache PWA-Icons ohne externe Abhängigkeiten
// Nutzt ein minimal PNG (indexed color, einfarbig) und schreibt es in public/
import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function encodePNG(size, bgR, bgG, bgB) {
  // PNG Signature
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.concat([t, data]);
    let crc = 0xffffffff;
    for (const b of crcBuf) {
      crc ^= b;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    crc = (~crc) >>> 0;
    const crcOut = Buffer.alloc(4);
    crcOut.writeUInt32BE(crc);
    return Buffer.concat([len, t, data, crcOut]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Image data: each row = filter byte (0) + RGB pixels
  const row = Buffer.alloc(1 + size * 3);
  row[0] = 0; // filter type None
  for (let x = 0; x < size; x++) {
    // Draw a simple "N" on cyan background with dark bg
    const cx = size / 2, cy = size / 2;
    const px = x; // column
    // will be filled per-row below
    row[1 + x * 3] = bgR;
    row[1 + x * 3 + 1] = bgG;
    row[1 + x * 3 + 2] = bgB;
  }

  // Build proper image with a simple design
  const imgData = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    imgData[y * (1 + size * 3)] = 0; // filter None
    for (let x = 0; x < size; x++) {
      const offset = y * (1 + size * 3) + 1 + x * 3;
      const nx = x / size, ny = y / size;
      const cx = 0.5, cy = 0.5;

      // Background: very dark blue
      let r = 6, g = 6, b = 15;

      // Border ring
      const margin = 0.06;
      const inBorder = nx > margin && nx < 1-margin && ny > margin && ny < 1-margin;
      const borderW = 0.04;
      const atBorder = (nx < margin + borderW || nx > 1-margin-borderW || ny < margin + borderW || ny > 1-margin-borderW) && inBorder;
      if (atBorder) { r = 0; g = 229; b = 255; }

      // "N" shape (simplified rasterization)
      const tx = nx * 100, ty = ny * 100;
      const lw = 10; // letter width in units
      const lh = 68;
      const lx = 16, ly = 16; // top-left of letter

      const inLeft  = tx >= lx && tx <= lx+lw && ty >= ly && ty <= ly+lh;
      const inRight = tx >= 100-lx-lw && tx <= 100-lx && ty >= ly && ty <= ly+lh;
      const diagW = 12;
      const diagT = (tx - lx) / (100 - 2*lx); // 0..1
      const diagY = ly + diagT * lh;
      const inDiag = tx >= lx && tx <= 100-lx && ty >= diagY - diagW/2 && ty <= diagY + diagW/2;

      if (inLeft || inRight || inDiag) {
        r = 0; g = 229; b = 255;
      }

      imgData[offset] = r;
      imgData[offset+1] = g;
      imgData[offset+2] = b;
    }
  }

  const compressed = deflateSync(imgData, { level: 9 });
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));
  const ihdrChunk = chunk('IHDR', ihdr);

  return Buffer.concat([sig, ihdrChunk, idat, iend]);
}

writeFileSync('public/icon-192.png', encodePNG(192, 6, 6, 15));
writeFileSync('public/icon-512.png', encodePNG(512, 6, 6, 15));
console.log('✓ PWA Icons erstellt: public/icon-192.png + icon-512.png');
