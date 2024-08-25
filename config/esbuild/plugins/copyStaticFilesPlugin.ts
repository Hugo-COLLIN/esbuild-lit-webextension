import fs from 'fs';
import path from 'path';

export const copyStaticFilesPlugin = (staticFiles: string[]) => {
  return {
    name: 'copy-static-files',
    setup(build: { onEnd: (arg0: () => void) => void; }) {
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
