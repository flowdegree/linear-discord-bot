import fetch from 'node-fetch';
import express, { Request } from 'express';

import { env } from './config';
import { getId, getPriorityValue, prettifyLabels } from './utils';
import { IncomingLinearWebhookPayload } from './types';

const app = express();

const port: number = parseInt(env.PORT ?? '3000');



app.use(express.json());

app.post<Request['params'], unknown, IncomingLinearWebhookPayload>('/linear', async (req, res) => {
  const payload = req.body;

  if (payload.action === 'create' && payload.type === 'Issue') {
    await newIssue(payload);
  }

  res.sendStatus(200);
});



function newIssue(payload: IncomingLinearWebhookPayload) {
  return fetch(env.DISCORD_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({
      embeds: [
        {
          color: 0x4752b2,
          author: {
            name: `Issue Created [${getId(payload.url)}]`,
          },
          title: payload.data.title,
          url: payload.url,
          fields: [
            {
              name: 'Priority',
              value: getPriorityValue(payload.data.priority ?? 0),
              inline: true,
            },
            {
              name: 'Points',
              value: payload.data.estimate,
              inline: true,
            },
            {
              name: 'Labels',
              value: prettifyLabels(payload.data.labels!),
              inline: false,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `Linear App`,
            icon_url: 'https://pbs.twimg.com/profile_images/1121592030449168385/MF6whgy1_400x400.png',
          },
        },
      ],
    }),
  });
}




app.listen(port, () => console.log(`Webhook consumer listening on port ${port}!`));