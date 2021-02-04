import fs from 'fs';
import { join } from 'path';
import OS from 'os';

export let path: string;

try {
  const data = fs.readFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'path.json')).toString();
  path = JSON.parse(data).path;
} catch (error) {
  path = join(OS.homedir(), 'Videos', 'Youtube');
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.webdl'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'path.json'), JSON.stringify({ path }));
}

export const setPath = (new_path: string) => {
  path = new_path;
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'path.json'), JSON.stringify({ path: new_path }));
};
