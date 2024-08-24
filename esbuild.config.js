const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Copier les fichiers statiques (HTML, manifest)
const copyStaticFiles = () => {
  const staticFiles = ['src/manifest.json'];

  staticFiles.forEach((file) => {
    const filePath = path.resolve(__dirname, file);
    const destPath = path.resolve(__dirname, 'dist', path.basename(file));
    fs.copyFileSync(filePath, destPath);
  });
};

// Configuration d'Esbuild
esbuild.build({
  entryPoints: ['src/background.ts', 'src/my-element.ts', 'src/popup.html'],
  bundle: true,
  outdir: 'dist',
  minify: true,
  sourcemap: true,
  target: ['chrome89', 'firefox89'],
  format: 'esm',
  logLevel: 'info',
  loader: {
    '.ts': 'ts',
    '.html': 'copy',  // On spécifie de copier le fichier HTML manuellement, donc on utilise 'copy'
  },
  entryNames: '[name]',  // Garder le même nom de fichier sans hash
}).then(() => {
  // Copier les fichiers statiques après la compilation
  copyStaticFiles();
}).catch(() => process.exit(1));
