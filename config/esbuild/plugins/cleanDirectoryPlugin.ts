import fs from 'fs';

export function cleanDirectoryPlugin(directory: string) {
  return {
    name: 'clean-directory',
    setup(build: { onStart: (arg0: () => void) => void; }) {
      build.onStart(() => {
        fs.rmSync(directory, {recursive: true, force: true});
      });
    },
  };
}
