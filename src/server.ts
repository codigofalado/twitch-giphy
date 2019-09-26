import path from 'path';
import express, { Request, Response } from 'express';
import http from 'http';
import io from 'socket.io';

export default function Server(): io.Server {
  const PORT = process.env.PORT || 3000;
  const app = express();

  app.use(express.static(path.resolve(process.cwd(), 'client')));

  // catch 404
  app.use((request: Request, response: Response): any => {
    response.status(404).send('Not found!');
  });

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Running on :${PORT}`);
  });

  const socket = io(server);

  return socket;
}
