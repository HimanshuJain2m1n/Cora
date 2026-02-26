import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexHtml = path.join(distDir, 'index.html');
const sidepanelHtml = path.join(distDir, 'sidepanel.html');

// Copy index.html to sidepanel.html
fs.copyFileSync(indexHtml, sidepanelHtml);

// Read sidepanel.html content
let content = fs.readFileSync(sidepanelHtml, 'utf-8');

// Remove the dev script if present
content = content.replace(
  /<script[^>]*src="\/src\/main\.jsx"[^>]*><\/script>\s*/g,
  ''
);

// Optionally, change the <title>
content = content.replace(
  /<title>.*<\/title>/,
  '<title>Cora Side Panel</title>'
);

// Save changes
fs.writeFileSync(sidepanelHtml, content);

console.log('sidepanel.html updated from index.html!');