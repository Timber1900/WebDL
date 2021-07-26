import { join } from 'path';
import OS from 'os';

export let path: string = window.localStorage.getItem('path') ?? join(OS.homedir(), 'Videos', 'Youtube');
if (!window.localStorage.getItem('path')) window.localStorage.setItem('path', path);

export const setPath = (new_path: string) => {
  path = new_path;
  window.localStorage.setItem('path', path);
};
