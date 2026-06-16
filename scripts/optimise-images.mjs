import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "assets");
const outputDir = path.join(sourceDir, "optimized");

const profiles = {
  hero: {
    widths: [960, 1440, 1920, 2560],
    webpQuality: 78,
    jpegQuality: 78,
  },
  product: {
    widths: [720, 1120],
    webpQuality: 80,
    jpegQuality: 80,
  },
  secondary: {
    widths: [720, 1200],
    webpQuality: 78,
    jpegQuality: 78,
  },
  wideSecondary: {
    widths: [720, 1200, 1920],
    webpQuality: 78,
    jpegQuality: 78,
  },
};

const images = [
  { name: "roam-hero-background-wide.png", profile: "hero" },
  { name: "roam-colourways-set.png", profile: "secondary" },
  { name: "roam-colour-lineup.png", profile: "secondary" },
  { name: "roam-destination-duo.png", profile: "secondary" },
  { name: "roam-destination-portrait.png", profile: "secondary" },
  { name: "roam-modal-hanging-colourways.png", profile: "secondary" },
  { name: "musician-studio.png", profile: "wideSecondary" },
  { name: "powerboard-detail.png", profile: "product" },
  { name: "powerboard-top.png", profile: "product" },
  { name: "powerboard-hero.png", profile: "product" },
  { name: "roam-brown-angle.png", profile: "product" },
  { name: "roam-brown-top.png", profile: "product" },
  { name: "roam-brown-detail.png", profile: "product" },
  { name: "roam-orange-angle.png", profile: "product" },
  { name: "roam-orange-top.png", profile: "product" },
  { name: "roam-orange-detail.png", profile: "product" },
  { name: "roam-blue-angle.png", profile: "product" },
  { name: "roam-blue-top.png", profile: "product" },
  { name: "roam-blue-detail.png", profile: "product" },
  { name: "roam-brown.png", profile: "product" },
  { name: "roam-orange.png", profile: "product" },
  { name: "roam-blue.png", profile: "product" },
  { name: "roam-blue-hand-hero.png", profile: "secondary" },
  { name: "roam-lifestyle-hero.png", profile: "product" },
];

async function fileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function outputName(sourceName, width, extension) {
  const parsed = path.parse(sourceName);
  return `${parsed.name}-${width}w.${extension}`;
}

async function optimizeImage({ name, profile }) {
  const config = profiles[profile];
  const sourcePath = path.join(sourceDir, name);
  const metadata = await sharp(sourcePath).metadata();
  const sourceSize = await fileSize(sourcePath);
  const widths = config.widths.filter((width) => width <= metadata.width);
  const outputs = [];

  for (const width of widths) {
    const base = sharp(sourcePath).resize({
      width,
      withoutEnlargement: true,
    });

    const webpName = outputName(name, width, "webp");
    const webpPath = path.join(outputDir, webpName);
    await base.clone().webp({ quality: config.webpQuality, effort: 6 }).toFile(webpPath);
    outputs.push({ file: webpName, size: await fileSize(webpPath) });

    const jpegName = outputName(name, width, "jpg");
    const jpegPath = path.join(outputDir, jpegName);
    await base
      .clone()
      .jpeg({ quality: config.jpegQuality, progressive: true, mozjpeg: true })
      .toFile(jpegPath);
    outputs.push({ file: jpegName, size: await fileSize(jpegPath) });
  }

  return {
    source: name,
    sourceSize,
    width: metadata.width,
    height: metadata.height,
    outputs,
  };
}

await mkdir(outputDir, { recursive: true });

const manifest = [];

for (const image of images) {
  const result = await optimizeImage(image);
  manifest.push(result);
  const smallest = result.outputs.reduce((min, item) => Math.min(min, item.size), Infinity);
  console.log(
    `${result.source}: ${result.width}x${result.height}, ${formatBytes(result.sourceSize)} -> smallest ${formatBytes(
      smallest
    )}`
  );
}

await writeFile(
  path.join(outputDir, "manifest.json"),
  JSON.stringify(
    manifest.map((entry) => ({
      ...entry,
      sourceSizeLabel: formatBytes(entry.sourceSize),
      outputs: entry.outputs.map((output) => ({
        ...output,
        sizeLabel: formatBytes(output.size),
      })),
    })),
    null,
    2
  )
);

const originalTotal = manifest.reduce((sum, entry) => sum + entry.sourceSize, 0);
const optimizedTotal = manifest.reduce(
  (sum, entry) => sum + entry.outputs.reduce((outputSum, output) => outputSum + output.size, 0),
  0
);

console.log(`Original source total: ${formatBytes(originalTotal)}`);
console.log(`Generated optimized total: ${formatBytes(optimizedTotal)}`);
