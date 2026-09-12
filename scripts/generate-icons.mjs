/**
 * Gera os ícones do PWA sem dependências externas.
 *
 * Desenha em supersampling 4x e reduz a imagem, o que dá bordas suaves sem
 * precisar de uma biblioteca de rasterização.
 *
 *   node scripts/generate-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const NAVY = [5, 36, 79];
const NAVY_DEEP = [3, 24, 47];
const ORANGE = [255, 91, 0];
const WHITE = [255, 255, 255];

const SUPERSAMPLE = 4;

/** Preenche um retângulo de cantos arredondados. */
function fillRoundedRect(
  pixels,
  size,
  { x, y, width, height, radius, color, alpha = 1 },
) {
  const r = Math.min(radius, width / 2, height / 2);

  for (
    let py = Math.max(0, Math.floor(y));
    py < Math.min(size, Math.ceil(y + height));
    py++
  ) {
    for (
      let px = Math.max(0, Math.floor(x));
      px < Math.min(size, Math.ceil(x + width));
      px++
    ) {
      const dx = Math.max(x + r - px, 0, px - (x + width - r));
      const dy = Math.max(y + r - py, 0, py - (y + height - r));

      if (dx > 0 && dy > 0 && dx * dx + dy * dy > r * r) continue;

      const index = (py * size + px) * 4;
      const [red, green, blue] = color;
      pixels[index] = Math.round(pixels[index] * (1 - alpha) + red * alpha);
      pixels[index + 1] = Math.round(pixels[index + 1] * (1 - alpha) + green * alpha);
      pixels[index + 2] = Math.round(pixels[index + 2] * (1 - alpha) + blue * alpha);
      pixels[index + 3] = 255;
    }
  }
}

/** Fundo em degradê vertical, do azul escuro ao azul profundo. */
function fillBackground(pixels, size) {
  for (let y = 0; y < size; y++) {
    const t = y / size;
    const color = NAVY.map((channel, i) =>
      Math.round(channel + (NAVY_DEEP[i] - channel) * t),
    );

    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      pixels[index] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = 255;
    }
  }
}

/**
 * Símbolo: três barras crescentes (evolução financeira), a última em laranja.
 * `scale` controla a zona segura — menor em ícones maskable.
 */
function drawSymbol(pixels, size, scale) {
  const box = size * scale;
  const originX = (size - box) / 2;
  const originY = (size - box) / 2;

  const gap = box * 0.12;
  const barWidth = (box - gap * 2) / 3;
  const heights = [0.46, 0.72, 1];
  const colors = [WHITE, WHITE, ORANGE];
  const alphas = [0.55, 0.8, 1];

  heights.forEach((heightRatio, index) => {
    const barHeight = box * heightRatio;

    fillRoundedRect(pixels, size, {
      x: originX + index * (barWidth + gap),
      y: originY + (box - barHeight),
      width: barWidth,
      height: barHeight,
      radius: barWidth * 0.34,
      color: colors[index],
      alpha: alphas[index],
    });
  });
}

/** Reduz a imagem por média de blocos (box filter). */
function downsample(source, sourceSize, factor) {
  const targetSize = sourceSize / factor;
  const target = Buffer.alloc(targetSize * targetSize * 4);

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const totals = [0, 0, 0, 0];

      for (let sy = 0; sy < factor; sy++) {
        for (let sx = 0; sx < factor; sx++) {
          const index = ((y * factor + sy) * sourceSize + (x * factor + sx)) * 4;
          for (let channel = 0; channel < 4; channel++) {
            totals[channel] += source[index + channel];
          }
        }
      }

      const samples = factor * factor;
      const targetIndex = (y * targetSize + x) * 4;
      for (let channel = 0; channel < 4; channel++) {
        target[targetIndex + channel] = Math.round(totals[channel] / samples);
      }
    }
  }

  return target;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);

  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));

  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(pixels, size) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  header[10] = 0; // deflate
  header[11] = 0; // filtro adaptativo
  header[12] = 0; // sem entrelaçamento

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);

  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filtro "none"
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function renderIcon(size, { maskable }) {
  const workingSize = size * SUPERSAMPLE;
  const pixels = Buffer.alloc(workingSize * workingSize * 4);

  fillBackground(pixels, workingSize);
  // Maskable reserva 20% de margem para o recorte do sistema operacional.
  drawSymbol(pixels, workingSize, maskable ? 0.52 : 0.66);

  return encodePng(downsample(pixels, workingSize, SUPERSAMPLE), size);
}

const TARGETS = [
  { path: "public/icons/icon-192.png", size: 192, maskable: false },
  { path: "public/icons/icon-512.png", size: 512, maskable: false },
  { path: "public/icons/maskable-512.png", size: 512, maskable: true },
  { path: "public/icons/apple-touch-icon.png", size: 180, maskable: true },
  { path: "src/app/icon.png", size: 64, maskable: false },
  { path: "src/app/apple-icon.png", size: 180, maskable: true },
];

for (const target of TARGETS) {
  const absolute = resolve(ROOT, target.path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, renderIcon(target.size, { maskable: target.maskable }));
  console.log(`gerado ${target.path} (${target.size}px)`);
}
