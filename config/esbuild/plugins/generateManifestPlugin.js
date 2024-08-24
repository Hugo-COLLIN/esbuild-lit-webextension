const path = require('path');
const { readJsonFile, writeJsonFile } = require("../../utils/jsonUtils");

function generateManifestPlugin(targetBrowser) {
  return {
    name: 'generate-manifest',
    setup(build) {
      build.onEnd(() => {
        const srcManifestPath = path.join(process.cwd(), 'src', 'manifest.json');
        const distManifestPath = path.join(process.cwd(), 'dist', 'manifest.json');
        const pkgPath = path.join(process.cwd(), 'package.json');

        const srcManifest = readJsonFile(srcManifestPath);
        const pkg = readJsonFile(pkgPath);

        let manifest = {};

        // Ensure manifest_version is correctly set
        manifest.manifest_version = srcManifest[`{{${targetBrowser}}}.manifest_version`] || 3;

        manifest['name'] = srcManifest['name'] || pkg.name;
        manifest['version'] = srcManifest['version'] || pkg.version;
        manifest['description'] = srcManifest['description'] || pkg.description;

        // Function to recursively process each property
        function processObject(obj, targetObj) {
          for (const key in obj) {
            const isBrowserSpecificKey = key.startsWith(`{{${targetBrowser}}}`);
            const cleanKey = key.replace(`{{${targetBrowser}}}.`, '');

            if (isBrowserSpecificKey) {
              if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                targetObj[cleanKey] = {};
                processObject(obj[key], targetObj[cleanKey]);
              } else {
                targetObj[cleanKey] = obj[key];
              }
            } else if (!key.includes('{{')) {
              if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                targetObj[key] = {};
                processObject(obj[key], targetObj[key]);
              } else {
                targetObj[key] = obj[key];
              }
            }
          }
        }

        processObject(srcManifest, manifest);

        writeJsonFile(distManifestPath, manifest);
      });
    }
  };
}

module.exports = { generateManifestPlugin };
