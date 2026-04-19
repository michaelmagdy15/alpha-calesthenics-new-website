import express from 'express';
import cors from 'cors';
import routes from './routes/assessment';
import paymentRoutes from './routes/payment';

const app = express();

// Middleware
const allowedOrigins = [
  'https://alpha-calisthenics.netlify.app',
  process.env.ALLOWED_ORIGIN,
  'http://localhost:5173'
].filter(Boolean) as string[];

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

// Webhook payload needs to be raw parsing for Stripe sig verification,
// but for standard use we can use json parser (adjust as needed if using Stripe signatures)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup API Routes
app.use('/api', routes);
app.use('/api', paymentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

export default app;
