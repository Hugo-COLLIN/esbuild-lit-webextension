const path = require('path');
const {readJsonFile, writeJsonFile} = require("./jsonUtils");


// Plugin pour générer le manifeste
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

        const mv = srcManifest[`{{${targetBrowser}}}.manifest_version`];

        let mvAttributes = {};
        if (mv === 3) {
          mvAttributes = {
            action: srcManifest[`{{${targetBrowser}}}.action`],
            host_permissions: srcManifest.host_permissions || ["http://localhost/*"],
          };
        } else if (mv === 2) {
          mvAttributes = {
            browser_action: srcManifest[`{{${targetBrowser}}}.action`]
          };
        }

        let browserAttributes = {};
        if (targetBrowser === 'firefox') {
          browserAttributes = {
            background: {
              scripts: srcManifest.background['{{firefox}}.scripts']
            },
            ...(srcManifest['browser_specific_settings']['gecko'] && {
              browser_specific_settings: {
                gecko: srcManifest['browser_specific_settings']['gecko']
              }
            })
          };
        } else if (targetBrowser === 'chrome') {
          browserAttributes = {
            background: {
              service_worker: srcManifest.background['{{chrome}}.service_worker']
            }
          };
        }

        const manifest = {
          manifest_version: mv,
          name: srcManifest['name'] || pkg.name,
          version: pkg.version,
          description: srcManifest.description,
          icons: srcManifest.icons,
          content_scripts: srcManifest.content_scripts,
          web_accessible_resources: srcManifest.web_accessible_resources,
          permissions: srcManifest.permissions,
          content_security_policy: srcManifest.content_security_policy && mv === 3
            ? {extension_pages: srcManifest.content_security_policy}
            : srcManifest.content_security_policy,
          ...mvAttributes,
          ...browserAttributes,
        };

        writeJsonFile(distManifestPath, manifest);
      });
    }
  };
}

module.exports = {generateManifestPlugin};
