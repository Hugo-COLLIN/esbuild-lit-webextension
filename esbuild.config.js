const esbuild = require('esbuild');
const fs = require('fs');
const chokidar = require('chokidar');
const {generateManifestPlugin} = require("./config/esbuild/plugins/generateManifestPlugin");
const {generateAppInfosPlugin} = require("./config/esbuild/plugins/generateAppInfosPlugin");
const {generateLicensesPlugin} = require("./config/esbuild/plugins/generateLicensesList");
const {copyStaticFilesPlugin} = require("./config/esbuild/plugins/copyStaticFilesPlugin");
const {cleanDirectoryPlugin} = require("./config/esbuild/plugins/cleanDirectoryPlugin");

const outdir = 'dist';
const targetBrowser = process.env.TARGET || 'chrome';
const appMode = process.env.APP_MODE || 'dev';
const watchMode = process.env.WATCH_MODE || false; // Flag for watch mode

const options = {
  entryPoints: ['src/background.js', 'src/my-element.ts', 'src/popup.html'],
  bundle: true,
  outdir: outdir,
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
    cleanDirectoryPlugin(outdir),
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

async function build() {
  await esbuild.build(options);
  console.log('Build completed successfully');
}

async function watch() {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching for file changes...');

  // Watch for changes in the 'public' folder
  watchDir(ctx);

  // // Watch for changes in the `public` directory
  // chokidar.watch('public').on('ready', async (path, details) => {
  //   console.log(`Detected changes on ${path || 'public'}, rebuilding...`);
  //   try {
  //     await ctx.rebuild();
  //     console.log('Rebuild completed successfully');
  //   } catch (error) {
  //     console.error('Rebuild failed:', error);
  //   }
  // });

  // --- No way to list the output files from `watch` mode ---
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

function watchDir(ctx) {
  const watcher = chokidar.watch('public', {
    ignoreInitial: true, // Ignore initial 'add' events on startup
  });

  let rebuildPending = false;

  watcher.on('all', async (event, path) => {
    if (!rebuildPending) {
      rebuildPending = true;
      console.log(`Detected ${event} on ${path}, scheduling rebuild...`);
      setTimeout(async () => {
        try {
          await ctx.rebuild();
          console.log('Rebuild completed successfully');
        } catch (error) {
          console.error('Rebuild failed:', error);
        } finally {
          rebuildPending = false;
        }
      }, 100); // Debounce delay to batch file changes
    }
  });
}
