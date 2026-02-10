import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import chatRoutes from './routes/chat.routes.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
