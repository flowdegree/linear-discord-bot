
import express, { Request } from 'express';

import { env } from './config';
import { Issue } from './services/issue';
import { IncomingLinearWebhookPayload } from './types';

const app = express();
const port: number = parseInt(env.PORT ?? '3000');
app.use(express.json());

app.post<Request['params'], unknown, IncomingLinearWebhookPayload>('/linear', async (req, res) => {
  const payload = req.body;
  console.log('Processing payload', payload.action, payload);

  try {
    if (payload.action === 'create' && payload.type === 'Issue') {
      await Issue.newIssue(payload);
      res.sendStatus(200);
    }
    else if (payload.action === 'update' && payload.type === 'Issue') {
      console.log('modified issue')
      await Issue.modifyIssue(payload);
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }
  } catch (error: any) {
    res.status(400).send({ status: 401, message: error.message });
  }
});

// get request to main directory prints hi
app.get('/', (req, res) => {
  res.send('Hi');
});




app.listen(port, () => console.log(`Webhook consumer listening on port ${port}!`));