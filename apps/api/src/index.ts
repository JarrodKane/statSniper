import { createServer } from './server';

const port = 3002;

const server = createServer();

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
