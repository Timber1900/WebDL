import express from 'express';
import { addToQueue } from './addToQueue';

export const port: `${number}` = (window.localStorage.getItem('port') as `${number}`) ?? '3003';

export const startServer = () => {
  const app = express();

  if (!window.localStorage.getItem('port')) window.localStorage.setItem('port', port);

  app.listen(port, () => {console.log(`%c Server open on port ${port}`, 'color: #0F1');});
  app.use(express.json());

  app.post('/', (req, res) => {
    console.log({req, res});
    const { body } = req;
    res.send('Video received');
    addToQueue(body.url);
  });
};
