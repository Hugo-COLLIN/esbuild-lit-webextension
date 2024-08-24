const fs = require('fs');
const path = require('path');
const {readJsonFile, writeJsonFile} = require("./jsonUtils");

function generateAppInfosPlugin(app_mode) {
  return {
    name: 'generate-app-infos',
    setup(build) {
      build.onEnd(() => {
        const distAppInfosPath = path.join(process.cwd(), 'dist', 'infos.json');
        const pkgPath = path.join(process.cwd(), 'package.json');
        const infosPath = path.join(process.cwd(), 'src', 'infos.json');

        const pkg = readJsonFile(pkgPath);
        const appMode = {APP_MODE: app_mode || 'dev'};

        const appInfos = {
          "APP_VERSION": pkg.version,
          "APP_DESCRIPTION": pkg.description,
          ...fs.existsSync(infosPath) && readJsonFile(infosPath),
          ...appMode
        };

        writeJsonFile(distAppInfosPath, appInfos);
      });
    }
  };
}

module.exports = {generateAppInfosPlugin};
