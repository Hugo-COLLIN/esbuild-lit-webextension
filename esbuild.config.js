const esbuild = require('esbuild');
const {generateManifestPlugin} = require("./config/esbuild/plugins/generateManifestPlugin");
const {generateAppInfosPlugin} = require("./config/esbuild/plugins/generateAppInfosPlugin");
const {generateLicensesPlugin} = require("./config/esbuild/plugins/generateLicensesList");
const {copyStaticFilesPlugin} = require("./config/esbuild/plugins/copyStaticFilesPlugin");

const targetBrowser = process.env.TARGET || 'chrome';
const appMode = process.env.APP_MODE || 'dev';
const watchMode = process.env.WATCH_MODE || false; // Flag for watch mode

const options = {
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
};

const job = watchMode ? watch : build;

job().catch((error) => {
  console.error('Build failed:', error);
  console.error('Stack Trace:', error.stack);
  process.exit(1);
});

async function watch() {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching for file changes...');

  // --- No way to get the output files from `watch` mode ---
  // await ctx.rebuild().then(result => {
  //   if (result.errors.length > 0) {
  //     console.error('Build failed with errors:');
  //     console.error(result.errors);
  //   } else {
  //     console.log('Build succeeded:');
  //     // Comme `result.outputFiles` n'est pas disponible, vous pouvez simplement afficher un message ou d'autres informations.
  //     // Pour obtenir les fichiers générés, vous devrez le faire manuellement car `result` ne contient pas directement `outputFiles`.
  //     // Par exemple, vous pouvez afficher les fichiers sortis de `outdir`.
  //     console.log('Output files:');
  //     result.outputFiles?.forEach(file => {
  //       console.log(`  ${file.path}  ${file.contents.length} bytes`);
  //     });
  //   }
  // });
}

async function build() {
  await esbuild.build(options);
  console.log('Build completed successfully');
}
