import express from 'express';
import fs from 'fs';
import { join } from 'path';
import OS from 'os';
import { addToQueue } from './addToQueue';

const app = express();

export let port: string = '3003';

try {
  const data = fs.readFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json')).toString();
  port = JSON.parse(data).port;
} catch (error) {
  port = '1234';
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.webdl'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json'), JSON.stringify({ port }));
}

app.listen(Number(port));
app.use(express.json());

app.post('/', (req, res) => {
  const { body } = req;
  res.send('Video received');
  addToQueue(body.url);
});
