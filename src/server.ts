import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Harmony API server is running on http://localhost:${PORT}`);
  console.log(`- Health Check: http://localhost:${PORT}/health`);
  console.log(`- API Endpoint: http://localhost:${PORT}/api/v1/analyze/progression`);
});
