import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import redis from './redisClient';
import { supabase } from './supabaseClient';

import { getOrSetCache } from './cacheUtils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/jobs', async (_req: Request, res: Response) => {
  try {
    const data = await getOrSetCache('jobs:active', async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    });

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await getOrSetCache(`job:${id}`, async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    });

    res.json(data);
  } catch (error: any) {
    console.error(`Error fetching job ${id}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
});

// Clear cache endpoint (e.g., call this when a job is added/updated)
app.post('/api/jobs/clear-cache', async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    if (id) {
      await redis.del(`job:${id}`);
    } else {
      await redis.del('jobs:active');
    }
    res.json({ message: 'Cache cleared' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', redis: redis.status });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
