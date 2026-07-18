import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.resolve(scriptDirectory, "..");
const assetsDirectory = path.join(clientDirectory, "src", "render", "assets");
const svgPath = path.join(assetsDirectory, "bbd.svg");
const svg = await readFile(svgPath);

const png = await sharp(svg)
  .resize(512, 512)
  .png()
  .toBuffer();

await writeFile(path.join(assetsDirectory, "bbd.png"), png);

const sizes = [16, 24, 32, 48, 64, 128, 256];
const images = await Promise.all(
  sizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

const headerSize = 6;
const directoryEntrySize = 16;
let imageOffset = headerSize + directoryEntrySize * images.length;
const header = Buffer.alloc(headerSize + directoryEntrySize * images.length);

header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);

images.forEach((image, index) => {
  const size = sizes[index];
  const entryOffset = headerSize + directoryEntrySize * index;

  header.writeUInt8(size === 256 ? 0 : size, entryOffset);
  header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
  header.writeUInt8(0, entryOffset + 2);
  header.writeUInt8(0, entryOffset + 3);
  header.writeUInt16LE(1, entryOffset + 4);
  header.writeUInt16LE(32, entryOffset + 6);
  header.writeUInt32LE(image.length, entryOffset + 8);
  header.writeUInt32LE(imageOffset, entryOffset + 12);

  imageOffset += image.length;
});

const ico = Buffer.concat([header, ...images]);
await Promise.all([
  writeFile(path.join(assetsDirectory, "bbd.ico"), ico),
  writeFile(path.join(clientDirectory, "src", "bbd.ico"), ico),
]);

console.log("Generated blue PNG and multi-resolution Windows ICO assets.");
