import app from './app.js';
import { ENV } from './config/env.js';

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`[Server] DeployFix Assistant running in ${ENV.NODE_ENV} mode on port ${PORT}`);
});
