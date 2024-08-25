import fs from "fs";

export function readJsonFile(filePath: string) {
  const json = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(json);
}

export function writeJsonFile(filePath: string, data: any) {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, json, 'utf8');
}
