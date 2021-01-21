const app = express();

let port;

try {
  port = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'port.json')).port;
} catch (err) {
  port = '1234';
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'port.json'), JSON.stringify({ port }));
}

console.log(port);

app.listen(Number(port));
app.use(express.json());
let path;
try {
  path = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json')).path;
} catch (err) {
  path = join(OS.homedir(), 'Videos', 'Youtube');
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json'), JSON.stringify({ path }));
}

app.post('/', (req, res) => {
  const { body } = req;
  res.send('Video received');
  console.log(body);
  addToQueue(body.url);
});
