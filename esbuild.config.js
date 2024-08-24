const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Copy static files
const copyStaticFiles = (staticFiles) => {
  staticFiles.forEach((file) => {
    const filePath = path.resolve(__dirname, file);
    const destPath = path.resolve(__dirname, 'dist', path.basename(file));
    fs.copyFileSync(filePath, destPath);
  });
};

// Esbuild Configuration
esbuild.build({
  entryPoints: ['src/background.ts', 'src/my-element.ts', 'src/popup.html'],
  bundle: true,
  outdir: 'dist',
  minify: false,
  sourcemap: true,
  target: ['chrome89', 'firefox89'],
  format: 'esm',
  logLevel: 'info',
  loader: {
    '.ts': 'ts',
    '.html': 'copy',
  },
  entryNames: '[name]',  // Keep the same file name without hash
}).then(() => {
  // Copier les fichiers statiques après la compilation
  copyStaticFiles('src/manifest.json');
}).catch(() => process.exit(1));
