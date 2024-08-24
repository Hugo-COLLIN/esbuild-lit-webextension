const esbuild = require('esbuild');
const {generateManifestPlugin} = require("./config/esbuild/plugins/generateManifestPlugin");
const {generateAppInfosPlugin} = require("./config/esbuild/plugins/generateAppInfosPlugin");
const {generateLicensesPlugin} = require("./config/esbuild/plugins/generateLicensesList");
const {copyStaticFilesPlugin} = require("./config/esbuild/plugins/copyStaticFilesPlugin");

// Détecter le navigateur cible
const targetBrowser = process.env.TARGET || 'chrome';
const appMode = process.env.APP_MODE || 'dev';

async function build() {
  const ctx = await esbuild.context({
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
      generateAppInfosPlugin(appMode),
      generateLicensesPlugin(),
      copyStaticFilesPlugin(['public']),
    ],
  });

  // Activate watch mode
  await ctx.watch();
  console.log('Watching for file changes...');
}

build().catch((error) => {
  console.error('Build failed:', error);
  console.error('Stack Trace:', error.stack);
  process.exit(1);
});
