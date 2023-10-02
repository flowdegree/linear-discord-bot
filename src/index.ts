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
  console.log('Processing payload', payload.action, payload);

  try {
    if (payload.action === 'create' && payload.type === 'Issue') {
      await newIssue(payload);
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }
  } catch (error: any) {
    res.status(400).send({ status: 401, message: error.message });
  }
});

function newIssue(payload: IncomingLinearWebhookPayload) {
  const URL = env.DISCORD_WEBHOOK_URL!;

  console.log('Sending to Discord', URL);

  const postData = JSON.stringify({
    //title: payload.data.title,
    //content: payload.data.description ?? `Issue Created [${getId(payload.url)}]`,
    embeds: [
      {
        color: 1127128,
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
          // {
          //   name: 'Points',
          //   value: payload.data.estimate ?? "None",
          //   inline: true,
          // },
          {
            name: 'Labels',
            value: prettifyLabels(payload.data.labels!),
            inline: false,
          },
        ],
        timestamp: new Date(),
        footer: {
          //text: `Linear App`,
          //icon_url: 'https://uploads.linear.app/30ac1b40-ffa2-48ae-aed7-1ee649a296e1/79d068cc-f8ed-47a8-ab19-c627cbb5c9e4/256x256/092eb7f1-d53a-4aa0-ad78-331fb4e804a3',
        },
      },
    ],
  });

  return fetch(URL, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: postData
  });
}


app.listen(port, () => console.log(`Webhook consumer listening on port ${port}!`));