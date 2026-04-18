import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());

// Webhook payload needs to be raw parsing for Stripe sig verification,
// but for standard use we can use json parser (adjust as needed if using Stripe signatures)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup API Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

export default app;
