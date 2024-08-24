const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const {generateManifestPlugin} = require("./config/esbuild/plugins/generateManifestPlugin");
const {generateAppInfosPlugin} = require("./config/esbuild/plugins/generateAppInfosPlugin");
const {generateLicensesPlugin} = require("./config/esbuild/plugins/generateLicensesList");
const {copyStaticFilesPlugin} = require("./config/esbuild/plugins/copyStaticFilesPlugin");

// Détecter le navigateur cible
const targetBrowser = process.env.TARGET || 'chrome';

esbuild.build({
  entryPoints: ['src/background.ts', 'src/my-element.ts', 'src/popup.html'],
  bundle: true,
  outdir: 'dist',
  minify: false,
  sourcemap: false,
  target: ['chrome89', 'firefox89'],
  format: 'esm',
  logLevel: 'info',
  loader: {
    '.ts': 'ts',
    '.html': 'copy',
  },
  entryNames: '[name]',
  plugins: [
    generateManifestPlugin(targetBrowser),
    generateAppInfosPlugin(process.env.NODE_ENV),
    generateLicensesPlugin(),
  ]
}).then(() => {
  // fill .then will break generateLicensesPlugin generation because it used exec()
}).catch(() => process.exit(1));
