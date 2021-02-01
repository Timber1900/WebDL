/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const app = express();

let port;

try {
  port = require(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json')).port;
} catch (err) {
  port = '1234';
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.webdl'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json'), JSON.stringify({ port }));
}

function selectPort() {
  let temp_port = prompt('Select the default port', port);
  if (/^[0-9]+$/.test(temp_port)) {
    port = temp_port;
  } else {
    alert('Port has to be a whole number');
  }
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json'), JSON.stringify({ port }));
  chrome.runtime.reload();
}

console.log(port);

app.listen(Number(port));
app.use(express.json());
let path;
try {
  path = require(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'path.json')).path;
} catch (err) {
  path = join(OS.homedir(), 'Videos', 'Youtube');
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.webdl'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'path.json'), JSON.stringify({ path }));
}

app.post('/', (req, res) => {
  const { body } = req;
  res.send('Video received');
  console.log(body);
  addToQueue(body.url);
});
