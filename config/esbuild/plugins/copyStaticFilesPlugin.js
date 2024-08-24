const fs = require('fs');
const path = require('path');

const copyStaticFilesPlugin = (staticFiles) => {
  return {
    name: 'copy-static-files',
    setup(build) {
      build.onEnd(() => {
        staticFiles.forEach((file) => {
          const filePath = path.resolve(process.cwd(), file);
          const destPath = path.resolve(process.cwd(), 'dist');
          fs.cpSync(filePath, destPath, { recursive: true });
        });
      });
    }
  };
};

module.exports = { copyStaticFilesPlugin };
