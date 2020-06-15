import express, { Response } from 'express';

import http from 'http';
import path from 'path';
import io from 'socket.io';

export default function Server(): io.Server {
  const PORT = process.env.PORT || 3000;
  const app = express();

  app.use(express.static(path.resolve(process.cwd(), 'client')));

  // Catch 404
  app.use((_, response: Response) => {
    return response.status(404).send('Not found!');
  });

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Running on :${PORT}`);
  });

  const socket = io(server);

  return socket;
}
