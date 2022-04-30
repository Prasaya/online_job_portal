#!/usr/bin/env node

require('tsconfig-paths/register');
import app from '@root/app';
import http from 'http';
import logger from '@utils/logger';

const port = parseInt(process.env.PORT || '8080', 10);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
  const addr = server.address();
  const formatted =
    typeof addr === 'string'
      ? addr
      : `${addr?.address || ''}:${addr?.port || ''}`;
  logger.info(`App: Listening on ${formatted}`);
});
server.on('error', logger.error);
