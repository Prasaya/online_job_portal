import './env';
import express, { ErrorRequestHandler } from 'express';
import apiRoute from '@routes/api/api';
import appSetup from '@utils/appSetup';
import logger from '@utils/logger';

const app = express();

appSetup(app);

app.use('/api', apiRoute);

app.use('*', (_req, res) => {
  res.sendFile('index.html', { root: './dist/public' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this is a global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  logger.log(err.stack);
  const sentError = err.expose ? err : {};
  return res
    .status(err.status || 500)
    .json({ message: 'Something went wrong!', err: sentError, success: false });
};
app.use(errorHandler);

export default app;
